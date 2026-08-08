import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderLookup from './components/OrderLookup';
import Login from './components/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('PRODUCTS');
  const [cart, setCart] = useState([]);
  const [lookupVisible, setLookupVisible] = useState(false);
  const [userToken, setUserToken] = useState(null);

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }
      setUserToken(token);
    };
    bootstrapAsync();
  }, []);

  const navigateToCart = () => setCurrentScreen('CART');
  const navigateToProducts = () => setCurrentScreen('PRODUCTS');
  
  const handleLogout = async () => {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
  };

  if (userToken == null) {
      return <Login onLoginSuccess={setUserToken} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateToProducts}>
            <Text style={styles.headerTitle}>Awesome Shop</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity testID="logout-button" style={styles.iconButton} onPress={handleLogout}>
              <Text style={styles.iconButtonText}>🚪</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="search-order-button" style={styles.iconButton} onPress={() => setLookupVisible(true)}>
              <Text style={styles.iconButtonText}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="cart-icon-button" style={styles.cartButton} onPress={navigateToCart}>
              <Text style={styles.cartButtonText}>🛒</Text>
              {cart.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {currentScreen === 'PRODUCTS' ? (
            <ProductList cart={cart} setCart={setCart} />
          ) : (
            <Cart cart={cart} setCart={setCart} onBack={navigateToProducts} />
          )}
        </View>
        <StatusBar style="dark" />
        <OrderLookup visible={lookupVisible} onClose={() => setLookupVisible(false)} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  iconButton: {
    padding: 8,
    marginRight: 10,
  },
  iconButtonText: {
    fontSize: 22,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartButtonText: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    width: '100%',
  }
});
