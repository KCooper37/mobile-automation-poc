import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ProductList = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://10.0.2.2:3005/api/products')
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setError("Network Connection Lost");
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  if (loading) {
    return <Text style={styles.loading}>Loading amazing products...</Text>;
  }

  if (error) {
    return (
      <View testID="network-error-state" style={styles.errorContainer}>
        <Text style={styles.errorText}>📡 {error}</Text>
        <Text style={styles.errorSubText}>Please check your connection and try again.</Text>
      </View>
    );
  }

  return (
    <View testID="product-list" style={styles.container}>
      <Text style={styles.sectionTitle}>Featured Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <View testID={`product-item-${item.id}`} style={styles.card}>
            <Image 
              source={{ uri: `https://picsum.photos/seed/${item.name}/300/200` }} 
              style={styles.productImage} 
            />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
              </View>
              <TouchableOpacity 
                testID={`add-to-cart-${item.id}`} 
                style={styles.addButton} 
                onPress={() => addToCart(item)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Add ${item.name} to cart`}
              >
                <Text style={styles.addButtonText}>Add to Cart 🛒</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 24, fontWeight: '800', marginBottom: 16, color: '#111827' },
  loading: { marginTop: 60, textAlign: 'center', fontSize: 18, color: '#6B7280' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 22, fontWeight: 'bold', color: '#EF4444', marginBottom: 8 },
  errorSubText: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden'
  },
  productImage: { width: '100%', height: 160 },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  productName: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  productPrice: { fontSize: 18, fontWeight: '800', color: '#3B82F6' },
  addButton: { backgroundColor: '#3B82F6', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});

export default ProductList;
