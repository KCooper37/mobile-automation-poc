import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:3005/api';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            
            if (data.success && data.token) {
                await AsyncStorage.setItem('userToken', data.token);
                onLoginSuccess(data.token);
            } else {
                Alert.alert('Error', data.message || 'Login failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error while logging in');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                testID="username-input"
            />
            <TextInput 
                style={styles.input} 
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                testID="password-input"
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin} testID="login-button">
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    button: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default Login;
