import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Image } from "react-native";
import { getProductsByCategory, addToCart } from "../services/FirestoreService";
import { useAuth } from "../services/AuthContext";

const ProductsScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      const data = await getProductsByCategory(category);
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
        <Text style={styles.price}>${item.price}</Text>

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
    <View style={styles.container}>
      <Text style={styles.header}>Products in {category}</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        ListEmptyComponent={<Text style={styles.empty}>No products in this category.</Text>}
      />
    </View>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777'
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
    elevation: 2,
  },
  imageContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  imageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555'
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
