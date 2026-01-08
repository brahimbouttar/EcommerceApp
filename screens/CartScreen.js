import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import { useAuth } from "../services/AuthContext";
import { getCart, updateCartQuantity, removeFromCart } from "../services/FirestoreService";
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reload cart when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [user])
  );

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const items = await getCart(user.uid);
      setCartItems(items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async (item) => {
    // Optimistic update
    const newQty = item.quantity + 1;
    updateLocalQty(item.id, newQty);
    try {
      await updateCartQuantity(user.uid, item.id, newQty);
    } catch (error) {
      Alert.alert("Error", "Could not update cart");
      updateLocalQty(item.id, item.quantity); // Revert
    }
  };

  const handleDecrease = async (item) => {
    const newQty = item.quantity - 1;
    if (newQty < 1) {
      handleRemove(item);
      return;
    }

    updateLocalQty(item.id, newQty);
    try {
      await updateCartQuantity(user.uid, item.id, newQty);
    } catch (error) {
      Alert.alert("Error", "Could not update cart");
      updateLocalQty(item.id, item.quantity); // Revert
    }
  };

  const handleRemove = async (item) => {
    Alert.alert("Remove Item", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: 'destructive',
        onPress: async () => {
          setCartItems(prev => prev.filter(i => i.id !== item.id));
          try {
            await removeFromCart(user.uid, item.id);
          } catch (error) {
            Alert.alert("Error", "Could not remove item");
            fetchCart(); // Revert/Reload
          }
        }
      }
    ]);
  };

  const updateLocalQty = (id, validQty) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: validQty } : item));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price} MAD each</Text>
      </View>

      <View style={styles.qtyContainer}>
        <TouchableOpacity onPress={() => handleDecrease(item)}>
          <Text style={styles.qtyBtn}>−</Text>
        </TouchableOpacity>

        <Text style={styles.qty}>{item.quantity}</Text>

        <TouchableOpacity onPress={() => handleIncrease(item)}>
          <Text style={styles.qtyBtn}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#1e90ff" /></View>;
  }

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />

          <View style={styles.footer}>
            <Text style={styles.total}>Total: {totalPrice.toFixed(2)} MAD</Text>
            <TouchableOpacity style={styles.checkoutBtn}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    color: "#777",
    marginTop: 4
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    fontSize: 22,
    paddingHorizontal: 12,
    fontWeight: 'bold',
    color: '#1e90ff'
  },
  qty: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 12,
    marginTop: 10
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkoutBtn: {
    backgroundColor: "#1e90ff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
  },
});

export default CartScreen;
