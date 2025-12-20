import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const categories = [
  { id: "1", name: "Mobiles", icon: "phone-portrait-outline" },
  { id: "2", name: "Laptops", icon: "laptop-outline" },
  { id: "3", name: "Headphones", icon: "headset-outline" },
  { id: "4", name: "TV & Video", icon: "tv-outline" },
  { id: "5", name: "Cameras", icon: "camera-outline" },
  { id: "6", name: "Accessories", icon: "hardware-chip-outline" },
];

const CategorieScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("Products", {
          category: item.name,
        })
      }
    >
      <Icon name={item.icon} size={36} color="#1e90ff" />
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </View>
  );
};

export default CategorieScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    elevation: 3,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
