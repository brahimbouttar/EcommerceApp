import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    ScrollView,
    Modal,
    ActivityIndicator
} from "react-native";
import {
    getProducts,
    getCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory
} from "../services/FirestoreService";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("Overview"); // Overview, Products, Categories
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // If null, we are adding new
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [itemCategory, setItemCategory] = useState("");
    const [itemImage, setItemImage] = useState("");
    const [categoryIcon, setCategoryIcon] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const pData = await getProducts();
            const cData = await getCategories();
            setProducts(pData);
            setCategories(cData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (activeTab === 'Products') {
                const productData = {
                    name: itemName,
                    price: parseFloat(itemPrice),
                    category: itemCategory,
                    // Add default image or whatever user typed
                    image: itemImage
                };
                if (editingItem) {
                    await updateProduct(editingItem.id, productData);
                } else {
                    await addProduct(productData);
                }
            } else if (activeTab === 'Categories') {
                const catData = {
                    name: itemName,
                    icon: categoryIcon || 'list'
                };
                // Note: Update category not implemented in service purely for brevity, but add/delete is
                if (editingItem) {
                    // await updateCategory(...) // Skipped for now as per plan
                    Alert.alert("Info", "Edit Category not fully supported in this demo yet. Delete and Re-add.");
                } else {
                    await addCategory(catData);
                }
            }
            setModalVisible(false);
            resetForm();
            fetchData();
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Alert.alert("Confirm Delete", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: async () => {
                    setLoading(true);
                    try {
                        if (activeTab === 'Products') await deleteProduct(id);
                        if (activeTab === 'Categories') await deleteCategory(id);
                        fetchData();
                    } catch (error) {
                        Alert.alert("Error", error.message);
                    } finally {
                        setLoading(false);
                    }
                }
            }
        ]);
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setItemName(item.name);
            if (activeTab === 'Products') {
                setItemPrice(item.price.toString());
                setItemCategory(item.category);
                setItemImage(item.image || "");
            } else {
                setCategoryIcon(item.icon);
            }
        } else {
            resetForm();
        }
        setModalVisible(true);
    }

    const resetForm = () => {
        setItemName("");
        setItemPrice("");
        setItemCategory("");
        setCategoryIcon("");
        setItemImage("");
        setEditingItem(null);
    }

    const renderOverview = () => (
        <View style={styles.overviewContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{products.length}</Text>
                <Text style={styles.statLabel}>Total Products</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{categories.length}</Text>
                <Text style={styles.statLabel}>Total Categories</Text>
            </View>
        </View>
    );

    const renderProductItem = ({ item }) => (
        <View style={styles.listItem}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSubText}>${item.price} - {item.category}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => openModal(item)} style={[styles.actionBtn, styles.editBtn]}>
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.actionBtn, styles.deleteBtn]}>
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCategoryItem = ({ item }) => (
        <View style={styles.listItem}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSubText}>Icon: {item.icon}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.actionBtn, styles.deleteBtn]}>
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Admin Dashboard</Text>

            {/* Tabs */}
            <View style={styles.tabs}>
                {['Overview', 'Products', 'Categories'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            {loading ? (
                <ActivityIndicator size="large" color="#1e90ff" style={{ marginTop: 50 }} />
            ) : (
                <View style={styles.content}>
                    {activeTab === 'Overview' && renderOverview()}

                    {activeTab === 'Products' && (
                        <>
                            <TouchableOpacity style={styles.addBtn} onPress={() => openModal(null)}>
                                <Text style={styles.addBtnText}>+ Add Product</Text>
                            </TouchableOpacity>
                            <FlatList
                                data={products}
                                renderItem={renderProductItem}
                                keyExtractor={item => item.id}
                            />
                        </>
                    )}

                    {activeTab === 'Categories' && (
                        <>
                            <TouchableOpacity style={styles.addBtn} onPress={() => openModal(null)}>
                                <Text style={styles.addBtnText}>+ Add Category</Text>
                            </TouchableOpacity>
                            <FlatList
                                data={categories}
                                renderItem={renderCategoryItem}
                                keyExtractor={item => item.id}
                            />
                        </>
                    )}
                </View>
            )}

            {/* Modal Form */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingItem ? 'Edit' : 'Add'} {activeTab === 'Products' ? 'Product' : 'Category'}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={itemName}
                            onChangeText={setItemName}
                        />

                        {activeTab === 'Products' && (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Price"
                                    value={itemPrice}
                                    onChangeText={setItemPrice}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Image URL"
                                    value={itemImage}
                                    onChangeText={setItemImage}
                                />
                                <Text style={styles.label}>Category:</Text>
                                <View style={styles.categorySelector}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {categories.map(cat => (
                                            <TouchableOpacity
                                                key={cat.id}
                                                style={[
                                                    styles.catChip,
                                                    itemCategory === cat.name && styles.activeCatChip
                                                ]}
                                                onPress={() => setItemCategory(cat.name)}
                                            >
                                                <Text style={[
                                                    styles.catChipText,
                                                    itemCategory === cat.name && styles.activeCatChipText
                                                ]}>
                                                    {cat.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </>
                        )}

                        {activeTab === 'Categories' && (
                            <TextInput
                                style={styles.input}
                                placeholder="Icon Name (Ionicons)"
                                value={categoryIcon}
                                onChangeText={setCategoryIcon}
                            />
                        )}

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleSave}>
                                <Text style={styles.modalBtnText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        paddingTop: 50, // Safe area ish
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: '#333'
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: '#e9ecef'
    },
    activeTab: {
        backgroundColor: '#1e90ff'
    },
    tabText: {
        color: '#495057',
        fontWeight: '600'
    },
    activeTabText: {
        color: '#fff'
    },
    content: {
        flex: 1,
        paddingHorizontal: 16
    },
    overviewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    statCard: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 4,
        width: '45%'
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1e90ff'
    },
    statLabel: {
        color: '#6c757d',
        marginTop: 5
    },
    addBtn: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15
    },
    addBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    listItem: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6'
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    itemSubText: {
        color: '#6c757d',
        fontSize: 14
    },
    actions: {
        flexDirection: 'row'
    },
    actionBtn: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginLeft: 8
    },
    editBtn: {
        backgroundColor: '#ffc107'
    },
    deleteBtn: {
        backgroundColor: '#dc3545'
    },
    actionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '90%',
        padding: 20,
        borderRadius: 12,
        elevation: 5
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    modalBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5
    },
    cancelBtn: {
        backgroundColor: '#6c757d'
    },
    saveBtn: {
        backgroundColor: '#1e90ff'
    },
    modalBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333'
    },
    categorySelector: {
        marginBottom: 15
    },
    catChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f1f3f5',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    activeCatChip: {
        backgroundColor: '#1e90ff',
        borderColor: '#1e90ff'
    },
    catChipText: {
        color: '#333',
        fontSize: 14
    },
    activeCatChipText: {
        color: '#fff',
        fontWeight: 'bold'
    }

});

export default Dashboard;
