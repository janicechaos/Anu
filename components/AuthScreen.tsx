import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { app } from './firebaseconfig.js';

const AuthScreen = ({ onAuthSuccess }: { onAuthSuccess?: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const auth = getAuth(app);

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!email || !password || (!isLogin && !confirmPassword)) {
      setError('Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess && onAuthSuccess();
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess('Registration successful!');
        setError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsLogin(true); // Optionally switch to login tab after registration
      }
    } catch (e: any) {
      setError(e.message || 'Authentication failed.');
    }
  };

  return (
    <LinearGradient
      colors={["#a78bfa", "#f472b6", "#6366f1"]}
      style={styles.gradient}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#eee"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#eee"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#eee"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSwitch}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 28,
    color: 'white',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    color: 'white',
  },
  button: {
    backgroundColor: '#e91e63',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
    textDecorationLine: 'underline',
    opacity: 0.9,
  },
  error: {
    color: '#ffb4b4',
    marginBottom: 8,
    fontSize: 15,
    textAlign: 'center',
  },
  success: {
    color: '#4ade80',
    marginBottom: 8,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AuthScreen; 