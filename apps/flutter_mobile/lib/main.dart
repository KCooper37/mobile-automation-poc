import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Awesome Shop',
      home: AuthWrapper(),
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});
  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  bool isLoading = true;
  bool isAuthenticated = false;

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('userToken');
    setState(() {
      isAuthenticated = token != null;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    if (isAuthenticated) {
      return ProductsScreen(onLogout: () async {
        final prefs = await SharedPreferences.getInstance();
        await prefs.remove('userToken');
        setState(() {
          isAuthenticated = false;
        });
      });
    }
    return LoginScreen(onLoginSuccess: () async {
      setState(() {
        isAuthenticated = true;
      });
    });
  }
}

class ProductsScreen extends StatefulWidget {
  final VoidCallback onLogout;
  const ProductsScreen({super.key, required this.onLogout});
  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  List<dynamic> products = [];
  List<dynamic> cart = [];
  bool hasError = false;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<void> fetchProducts() async {
    try {
      final response = await http.get(Uri.parse('http://10.0.2.2:3005/api/products'));
      if (response.statusCode == 200) {
        setState(() {
          products = json.decode(response.body);
          hasError = false;
          isLoading = false;
        });
      } else {
        setState(() {
          hasError = true;
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        hasError = true;
        isLoading = false;
      });
    }
  }

  void addToCart(dynamic product) {
    setState(() {
      final existing = cart.where((item) => item['id'] == product['id']).toList();
      if (existing.isNotEmpty) {
        existing.first['quantity'] = (existing.first['quantity'] ?? 1) + 1;
      } else {
        cart.add({...product, 'quantity': 1});
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Awesome Shop'),
        actions: [
          IconButton(
            key: const Key('logout-button'),
            icon: const Text('🚪', style: TextStyle(fontSize: 20)),
            onPressed: widget.onLogout,
          ),
          IconButton(
            icon: const Text('🔍', style: TextStyle(fontSize: 20)),
            onPressed: () {
              // Order lookup logic
            },
          ),
          IconButton(
            icon: const Text('🛒', style: TextStyle(fontSize: 20)),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => CartScreen(cart: cart)),
              );
            },
          ),
        ],
      ),
      body: isLoading 
        ? const Center(child: CircularProgressIndicator())
        : hasError 
        ? Center(
            key: const Key('network-error-state'),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('📡 Network Connection Lost', style: TextStyle(fontSize: 22, color: Colors.red, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                const Text('Please check your connection and try again.', style: TextStyle(color: Colors.grey)),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    setState(() { isLoading = true; hasError = false; });
                    fetchProducts();
                  },
                  child: const Text('Retry'),
                )
              ]
            )
          )
        : ListView.builder(
            itemCount: products.length,
            itemBuilder: (context, index) {
              final p = products[index];
              return ListTile(
                title: Text(p['name']),
                subtitle: Text('\$${p['price']}'),
                trailing: Semantics(
                  button: true,
                  label: 'Add ${p['name']} to cart',
                  child: ElevatedButton(
                    onPressed: () => addToCart(p),
                    child: const Text('Add to Cart 🛒'),
                  ),
                ),
              );
            },
          ),
    );
  }
}

class CartScreen extends StatefulWidget {
  final List<dynamic> cart;
  const CartScreen({super.key, required this.cart});
  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  List<dynamic> localCart = [];
  String status = '';

  @override
  void initState() {
    super.initState();
    localCart = List.from(widget.cart);
  }

  Future<void> checkout() async {
    final response = await http.post(
      Uri.parse('http://10.0.2.2:3005/api/checkout'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'cart': localCart}),
    );
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        status = 'Success! Order placed.\nOrder ID: ${data['orderId']}';
        localCart.clear();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Cart'),
        leading: IconButton(
          icon: const Text('← Back', style: TextStyle(color: Colors.blue)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: localCart.length,
              itemBuilder: (context, index) {
                final item = localCart[index];
                return ListTile(
                  title: Text(item['name']),
                  subtitle: Text('Qty: ${item['quantity'] ?? 1}'),
                  trailing: Text('\$${(item['price'] * (item['quantity'] ?? 1)).toStringAsFixed(2)}'),
                );
              },
            ),
          ),
          if (status.isNotEmpty) Text(status),
          ElevatedButton(
            onPressed: checkout,
            child: const Text('Checkout Cart'),
          ),
        ],
      ),
    );
  }
}

class LoginScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;
  const LoginScreen({super.key, required this.onLoginSuccess});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  String errorMsg = '';

  Future<void> handleLogin() async {
    final response = await http.post(
      Uri.parse('http://10.0.2.2:3005/api/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'username': _usernameController.text,
        'password': _passwordController.text,
      }),
    );
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userToken', data['token']);
      widget.onLoginSuccess();
    } else {
      setState(() {
        errorMsg = 'Invalid credentials';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Awesome Shop Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              key: const Key('username-input'),
              controller: _usernameController,
              decoration: const InputDecoration(labelText: 'Username'),
            ),
            TextField(
              key: const Key('password-input'),
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            if (errorMsg.isNotEmpty) Text(errorMsg, style: const TextStyle(color: Colors.red)),
            ElevatedButton(
              key: const Key('login-button'),
              onPressed: handleLogin,
              child: const Text('Login'),
            ),
          ],
        ),
      ),
    );
  }
}
