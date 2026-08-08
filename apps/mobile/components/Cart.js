import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';

const Cart = ({ cart, setCart, onBack }) => {
  const [status, setStatus] = useState('');
  const [cartName, setCartName] = useState('');
  const [savedCarts, setSavedCarts] = useState([]);

  useEffect(() => {
    fetchSavedCarts();
  }, []);

  const fetchSavedCarts = () => {
    fetch('http://10.0.2.2:3005/api/carts')
      .then(res => res.json())
      .then(data => {
        if (data.carts) setSavedCarts(data.carts);
      })
      .catch(err => console.error('Error fetching carts:', err));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setStatus('Cart is empty!');
      return;
    }
    setStatus('Checking out...');
    fetch('http://10.0.2.2:3005/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus(`Success! Order placed.\nOrder ID: ${data.orderId}`);
          setCart([]);
          // Wait 3 seconds so the user can read the order ID before going back
          setTimeout(() => {
            onBack();
          }, 3000);
        } else {
          setStatus('Failed');
        }
      })
      .catch(err => {
        console.error(err);
        setStatus('Error during checkout.');
      });
  };

  const loadSavedCart = (selectedCart) => {
    setCart(selectedCart.cart);
    setStatus(`Loaded cart: ${selectedCart.name}`);
  };

  const saveCartForLater = () => {
    if (!cartName) {
      setStatus('Please enter a name for the cart');
      return;
    }
    setStatus('Saving cart...');
    fetch('http://10.0.2.2:3005/api/carts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: cartName, cart })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus(`Cart '${cartName}' saved!`);
          setCartName('');
          fetchSavedCarts(); // Refresh list
        } else {
          setStatus('Failed to save cart');
        }
      })
      .catch(err => {
        console.error(err);
        setStatus('Error saving cart.');
      });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Your Cart</Text>
        <TouchableOpacity testID="back-to-products" onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
      
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity || 1}</Text>
              </View>
              <Text style={styles.itemPrice}>${(item.price * (item.quantity || 1)).toFixed(2)}</Text>
            </View>
          )}
        />
      )}

      {cart.length > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${total}</Text>
        </View>
      )}

      <View style={styles.saveCartContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter cart name to save"
          value={cartName}
          onChangeText={setCartName}
        />
        <TouchableOpacity style={styles.secondaryBtn} onPress={saveCartForLater}>
          <Text style={styles.secondaryBtnText}>Save Cart</Text>
        </TouchableOpacity>
      </View>

      {savedCarts.length > 0 && (
        <View style={styles.savedCartsContainer}>
          <Text style={styles.savedCartsTitle}>Load a Saved Cart:</Text>
          <FlatList
            horizontal
            data={savedCarts}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.loadCartBtn} onPress={() => loadSavedCart(item)}>
                <Text style={styles.loadCartBtnText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <TouchableOpacity
        testID="checkout-button"
        style={styles.checkoutBtn}
        onPress={handleCheckout}
      >
        <Text style={styles.checkoutBtnText}>Checkout Cart</Text>
      </TouchableOpacity>
      {status ? <Text testID="checkout-status" style={styles.statusText}>{status}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderColor: '#333',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  saveCartContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  secondaryBtn: {
    backgroundColor: '#E5E5EA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  secondaryBtnText: {
    color: '#333',
    fontWeight: '600',
  },
  savedCartsContainer: {
    marginBottom: 20,
  },
  savedCartsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  loadCartBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  loadCartBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },
  checkoutBtn: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  }
});

export default Cart;
