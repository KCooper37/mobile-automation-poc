import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, Alert } from 'react-native';

const OrderLookup = ({ visible, onClose }) => {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const lookupOrder = () => {
    if (!orderId) {
      Alert.alert('Error', 'Please enter an Order ID');
      return;
    }
    setLoading(true);
    setOrderDetails(null);
    fetch(`http://10.0.2.2:3005/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          setOrderDetails(data.order);
        } else {
          Alert.alert('Not Found', 'Order could not be found.');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        Alert.alert('Error', 'Failed to lookup order');
      });
  };

  const calculateTotal = (cart) => {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Lookup Order</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>X</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter Order ID (e.g. ORD-123456)"
              value={orderId}
              onChangeText={setOrderId}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={lookupOrder}>
              <Text style={styles.searchBtnText}>Search</Text>
            </TouchableOpacity>
          </View>

          {loading && <Text style={styles.loadingText}>Searching...</Text>}

          {orderDetails && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Order: {orderDetails.id}</Text>
              <FlatList
                data={orderDetails.cart}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.cartItem}>
                    <View>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>Qty: {item.quantity || 1}</Text>
                    </View>
                    <Text style={styles.itemPrice}>${(item.price * (item.quantity || 1)).toFixed(2)}</Text>
                  </View>
                )}
                style={styles.list}
              />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalAmount}>${calculateTotal(orderDetails.cart)}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeBtn: {
    padding: 8,
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#F9F9F9',
  },
  searchBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  resultContainer: {
    flexShrink: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
    paddingBottom: 8,
  },
  list: {
    flexGrow: 0,
    maxHeight: 300,
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
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  }
});

export default OrderLookup;
