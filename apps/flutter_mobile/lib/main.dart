import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Awesome Shop',
      home: ProductsScreen(),
    );
  }
}

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});
  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  List<dynamic> products = [];
  List<dynamic> cart = [];

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<void> fetchProducts() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:3005/api/products'));
    if (response.statusCode == 200) {
      setState(() {
        products = json.decode(response.body);
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
      body: ListView.builder(
        itemCount: products.length,
        itemBuilder: (context, index) {
          final p = products[index];
          return ListTile(
            title: Text(p['name']),
            subtitle: Text('\$${p['price']}'),
            trailing: ElevatedButton(
              onPressed: () => addToCart(p),
              child: const Text('Add to Cart 🛒'),
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
