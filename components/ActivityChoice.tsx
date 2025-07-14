import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface ActivityChoiceProps {
  onChoice: (choice: 'mental' | 'physical' | 'both') => void;
}

export default function ActivityChoice({ onChoice }: ActivityChoiceProps) {
  return (
    <LinearGradient
      colors={['#a78bfa', '#f472b6', '#6366f1']}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          What kind of activity do you want today?
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onChoice('mental')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>🧠 Mental Health Activities</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => onChoice('physical')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>🏃 Physical Health Activities</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => onChoice('both')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>🌈 Both</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
}); 