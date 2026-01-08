import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from '../services/AuthContext';
import { addToCart } from '../services/FirestoreService';

const ProductDetailsScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () => {
        if (!user) {
            Alert.alert("Please login", "You need to be logged in to add items to cart.");
            return;
        }
        setLoading(true);
        try {
            await addToCart(user.uid, product);
            Alert.alert("Success", "Added to cart!");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not add to cart.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageContainer}>
                    {product.image ? (
                        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>{product.name[0]}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.category}>{product.category}</Text>
                    <Text style={styles.price}>{product.price} MAD</Text>

                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.description}>
                        {product.description || "No description available for this product. High quality and best price guaranteed."}
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.addToCartBtn, loading && styles.disabledBtn]}
                    onPress={handleAddToCart}
                    disabled={loading}
                >
                    <Text style={styles.btnText}>{loading ? "Adding..." : "Add to Cart"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    backBtn: {
        padding: 8,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    imageContainer: {
        height: 300,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: 150,
        height: 150,
        backgroundColor: '#eee',
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 50,
        color: '#888',
        fontWeight: 'bold',
    },
    infoContainer: {
        padding: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    category: {
        fontSize: 16,
        color: '#777',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 5,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1e90ff',
        marginBottom: 20,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    addToCartBtn: {
        backgroundColor: '#1e90ff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    disabledBtn: {
        backgroundColor: '#a0cfff',
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProductDetailsScreen;
