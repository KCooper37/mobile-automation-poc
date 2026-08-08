import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Cart = () => {
  const [status, setStatus] = useState('');

  const handleCheckout = () => {
    setStatus('Checking out...');
    fetch('http://10.0.2.2:3001/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: [] })
    })
      .then(res => res.json())
      .then(data => {
        setStatus(data.success ? 'Success' : 'Failed');
      })
      .catch(err => {
        console.error(err);
        setStatus('Error');
      });
  };

  return (
    <View style={styles.container}>
      <Button
        testID="checkout-button"
        title="Checkout"
        onPress={handleCheckout}
      />
      {status ? <Text testID="checkout-status">{status}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  }
});

export default Cart;
