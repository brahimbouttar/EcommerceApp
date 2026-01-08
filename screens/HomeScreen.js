import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image
} from "react-native";
import { getProducts, addToCart } from "../services/FirestoreService";
import { useAuth } from "../services/AuthContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      Alert.alert("Please login", "You need to be logged in to add items to cart.");
      return;
    }
    try {
      await addToCart(user.uid, product);
      Alert.alert("Success", "Added to cart!");
    } catch (error) {
      Alert.alert("Error", "Could not add to cart.");
    }
  }

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
        ) : (
          <Text style={styles.imageText}>{item.name[0]}</Text>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.price}>{item.price} MAD</Text>

        <TouchableOpacity style={styles.cartBtn} onPress={() => handleAddToCart(item)}>
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#1e90ff" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* 
        Note: I am rendering the same list for New and Popular for demonstration 
        since we might not have a 'type' field yet. 
      */}
      <Text style={styles.sectionTitle}>New Products</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={<Text style={{ textAlign: 'center', margin: 20 }}>No products found.</Text>}
      />

      <Text style={styles.sectionTitle}>All Products</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 2,
    elevation: 2,
  },
  imageContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  imageText: {
    color: "#555",
    fontSize: 24,
    fontWeight: "bold"
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: '#333'
  },
  price: {
    fontSize: 16,
    color: '#1e90ff',
    fontWeight: 'bold',
    marginBottom: 10
  },
  cartBtn: {
    backgroundColor: "#1e90ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  cartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: '600'
  },
});

export default HomeScreen;
