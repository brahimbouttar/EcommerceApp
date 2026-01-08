import { db } from "../firebaseConfig";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    addDoc,
    setDoc,
    deleteDoc,
    updateDoc
} from "firebase/firestore";

// Collection References
const productsRef = collection(db, "products");
const categoriesRef = collection(db, "categories");

// --- Products & Categories ---

export const getProducts = async () => {
    try {
        const snapshot = await getDocs(productsRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getCategories = async () => {
    try {
        const snapshot = await getDocs(categoriesRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const getProductsByCategory = async (categoryName) => {
    try {
        const q = query(productsRef, where("category", "==", categoryName));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return [];
    }
};

export const addProduct = async (productData) => {
    try {
        await addDoc(productsRef, productData);
        return true;
    } catch (error) {
        console.error("Error adding product: ", error);
        throw error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const docRef = doc(db, "products", productId);
        await updateDoc(docRef, productData);
        return true;
    } catch (error) {
        console.error("Error updating product: ", error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        await deleteDoc(doc(db, "products", productId));
        return true;
    } catch (error) {
        console.error("Error deleting product: ", error);
        throw error;
    }
};

export const addCategory = async (categoryData) => {
    try {
        await addDoc(categoriesRef, categoryData);
        return true;
    } catch (error) {
        console.error("Error adding category: ", error);
        throw error;
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        await deleteDoc(doc(db, "categories", categoryId));
        return true;
    } catch (error) {
        console.error("Error deleting category: ", error);
        throw error;
    }
};

// --- Cart Management ---

export const addToCart = async (userId, product) => {
    try {
        const cartRef = doc(db, "carts", userId);
        const cartSnap = await getDoc(cartRef);

        let currentItems = [];
        if (cartSnap.exists()) {
            currentItems = cartSnap.data().items || [];
        }

        const existingItemIndex = currentItems.findIndex(item => item.id === product.id);

        if (existingItemIndex >= 0) {
            currentItems[existingItemIndex].quantity += 1;
        } else {
            currentItems.push({ ...product, quantity: 1 });
        }

        await setDoc(cartRef, { items: currentItems }, { merge: true });
        return currentItems;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

export const removeFromCart = async (userId, productId) => {
    try {
        const cartRef = doc(db, "carts", userId);
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
            let currentItems = cartSnap.data().items || [];
            const newItems = currentItems.filter(item => item.id !== productId);
            await updateDoc(cartRef, { items: newItems });
            return newItems;
        }
        return [];
    } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
    }
};

export const updateCartQuantity = async (userId, productId, quantity) => {
    try {
        const cartRef = doc(db, "carts", userId);
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
            let currentItems = cartSnap.data().items || [];
            const itemIndex = currentItems.findIndex(item => item.id === productId);

            if (itemIndex >= 0) {
                if (quantity > 0) {
                    currentItems[itemIndex].quantity = quantity;
                } else {
                    // Remove if quantity is 0
                    currentItems = currentItems.filter(item => item.id !== productId);
                }
                await updateDoc(cartRef, { items: currentItems });
                return currentItems;
            }
        }
        return [];
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        throw error;
    }
};

export const getCart = async (userId) => {
    try {
        const cartRef = doc(db, "carts", userId);
        const cartSnap = await getDoc(cartRef);
        if (cartSnap.exists()) {
            return cartSnap.data().items || [];
        }
        return [];
    } catch (error) {
        console.error("Error getting cart:", error);
        return [];
    }
};
