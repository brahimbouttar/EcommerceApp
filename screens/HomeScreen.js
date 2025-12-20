import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";


const products = [
  { id: "1", name: "iPhone 15", price: 999 },
  { id: "2", name: "Samsung S24", price: 899 },
  { id: "3", name: "MacBook Pro", price: 1999 },
  { id: "4", name: "Gaming Headset", price: 149 },
];

const HomeScreen = () => {
  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>Image</Text>
      </View>

      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.price}>${item.price}</Text>

      <TouchableOpacity style={styles.cartBtn}>
        <Text style={styles.cartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>New Products</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
      />
      <Text style={styles.sectionTitle}>Popular Products</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  category: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    margin: 6,
  },
  imagePlaceholder: {
    height: 100,
    backgroundColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  imageText: {
    color: "#555",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    marginVertical: 4,
  },
  cartBtn: {
    backgroundColor: "#1e90ff",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  cartText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default HomeScreen;
