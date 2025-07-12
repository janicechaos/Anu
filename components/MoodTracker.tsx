import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const MoodTracker = () => {
  const [mood, setMood] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState(5);
  const [showEmotionsTab, setShowEmotionsTab] = useState(false);
  const [selectedEmotions, setSelectedEmotions] = useState<number[]>([]);

  const moodEmojis: { [key: number]: string } = {
    1: '😭',
    2: '😢',
    3: '😔',
    4: '😕',
    5: '😐',
    6: '🙂',
    7: '😊',
    8: '😄',
    9: '😁',
    10: '🤩'
  };

  const emotions = [
    { id: 1, name: 'Happy', emoji: '😊', color: '#FFD93D' },
    { id: 2, name: 'Excited', emoji: '🤩', color: '#9F7AEA' },
    { id: 3, name: 'Stressed', emoji: '😰', color: '#FF6B6B' },
    { id: 4, name: 'Anxious', emoji: '😟', color: '#FF8E53' },
    { id: 5, name: 'Calm', emoji: '😌', color: '#4ECDC4' },
    { id: 6, name: 'Grateful', emoji: '🙏', color: '#6BCF7F' },
    { id: 7, name: 'Tired', emoji: '😴', color: '#A0AEC0' },
    { id: 8, name: 'Energetic', emoji: '⚡', color: '#FFD93D' },
    { id: 9, name: 'Sad', emoji: '😢', color: '#4A90E2' },
    { id: 10, name: 'Angry', emoji: '😠', color: '#FF6B6B' },
    { id: 11, name: 'Confident', emoji: '💪', color: '#9F7AEA' },
    { id: 12, name: 'Overwhelmed', emoji: '😵', color: '#FF8E53' },
    { id: 13, name: 'Peaceful', emoji: '🕊️', color: '#4ECDC4' },
    { id: 14, name: 'Motivated', emoji: '🔥', color: '#FFA726' },
    { id: 15, name: 'Lonely', emoji: '😔', color: '#A0AEC0' },
    { id: 16, name: 'Hopeful', emoji: '🌟', color: '#6BCF7F' },
    { id: 17, name: 'Frustrated', emoji: '😤', color: '#FF6B6B' },
    { id: 18, name: 'Content', emoji: '😊', color: '#45B7D1' },
    { id: 19, name: 'Curious', emoji: '🤔', color: '#5A67D8' },
    { id: 20, name: 'Loved', emoji: '🥰', color: '#EC4899' },
  ];

  const getMoodColor = (value: number) => {
    const colors = [
      '#FF6B6B', // 1 - Red
      '#FF8E53', // 2 - Orange-Red
      '#FF9F43', // 3 - Orange
      '#FFA726', // 4 - Light Orange
      '#FFD93D', // 5 - Yellow
      '#6BCF7F', // 6 - Light Green
      '#4ECDC4', // 7 - Teal
      '#45B7D1', // 8 - Light Blue
      '#5A67D8', // 9 - Blue
      '#9F7AEA'  // 10 - Purple
    ];
    return colors[value - 1];
  };

  const handleSliderChange = (value: number) => {
    const roundedValue = Math.round(value);
    setSliderValue(roundedValue);
    setMood(roundedValue);
  };

  const getMoodMessage = (moodValue: number) => {
    if (moodValue <= 3) return "Take care of yourself today 💙";
    if (moodValue >= 4 && moodValue <= 6) return "Every day is a new opportunity 🌟";
    if (moodValue >= 7 && moodValue <= 8) return "Great to hear you're doing well! 😊";
    if (moodValue >= 9) return "You're radiating positive energy! ✨";
    return "How are you feeling?";
  };

  const handleContinueToEmotions = () => {
    setShowEmotionsTab(true);
  };

  const toggleEmotion = (emotionId: number) => {
    setSelectedEmotions(prev => {
      if (prev.includes(emotionId)) {
        return prev.filter(id => id !== emotionId);
      } else if (prev.length < 5) {
        return [...prev, emotionId];
      }
      return prev;
    });
  };

  const handleFinish = () => {
    console.log('Mood saved:', mood);
    console.log('Selected emotions:', selectedEmotions);
    // Reset for next use
    setMood(null);
    setSliderValue(5);
    setShowEmotionsTab(false);
    setSelectedEmotions([]);
  };

  return (
    <LinearGradient
      colors={['#A855F7', '#C084FC', '#E879F9', '#F472B6']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.card}>
        {!showEmotionsTab ? (
          // Mood Slider Tab
          <>
            <View style={styles.header}>
              <Text style={styles.title}>How are you feeling today?</Text>
              <Text style={styles.subtitle}>Move the slider to express your mood</Text>
            </View>

            <View style={styles.sliderContainer}>
              {/* Emoji labels */}
              <View style={styles.emojiContainer}>
                {Object.entries(moodEmojis).map(([value, emoji]) => (
                  <Text
                    key={value}
                    style={[
                      styles.emoji,
                      parseInt(value) === sliderValue && styles.selectedEmoji
                    ]}
                  >
                    {emoji}
                  </Text>
                ))}
              </View>

              {/* Slider */}
              <View style={styles.sliderWrapper}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  value={sliderValue}
                  onValueChange={handleSliderChange}
                  step={1}
                  minimumTrackTintColor={getMoodColor(sliderValue)}
                  maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                  thumbTintColor={getMoodColor(sliderValue)}
                />
              </View>

              {/* Selected mood display */}
              {mood && (
                <View style={styles.moodDisplay}>
                  <Text style={styles.selectedMoodEmoji}>
                    {moodEmojis[mood]}
                  </Text>
                  <Text style={styles.moodNumber}>{mood}/10</Text>
                  <Text style={styles.moodMessage}>
                    {getMoodMessage(mood)}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleContinueToEmotions}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Continue</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Emotions Selection Tab
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Describe how you're feeling</Text>
              <Text style={styles.subtitle}>Select up to 5 emotions ({selectedEmotions.length}/5)</Text>
            </View>

            <View style={styles.emotionsScrollContainer}>
              <ScrollView contentContainerStyle={styles.emotionsContainer} showsVerticalScrollIndicator={false}>
                {emotions.map((emotion) => (
                  <TouchableOpacity
                    key={emotion.id}
                    style={[
                      styles.emotionChip,
                      selectedEmotions.includes(emotion.id) && {
                        backgroundColor: emotion.color + '40',
                        borderColor: emotion.color,
                      }
                    ]}
                    onPress={() => toggleEmotion(emotion.id)}
                    disabled={!selectedEmotions.includes(emotion.id) && selectedEmotions.length >= 5}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
                    <Text style={[
                      styles.emotionText,
                      selectedEmotions.includes(emotion.id) && { color: 'white', fontWeight: 'bold' }
                    ]}>
                      {emotion.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setShowEmotionsTab(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.finishButton, selectedEmotions.length === 0 && styles.disabledButton]}
                onPress={handleFinish}
                disabled={selectedEmotions.length === 0}
                activeOpacity={0.8}
              >
                <Text style={styles.finishButtonText}>Finish</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 30,
    width: width - 40,
    maxWidth: 400,
    maxHeight: height - 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  sliderContainer: {
    marginBottom: 30,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  emoji: {
    fontSize: 24,
    opacity: 0.6,
  },
  selectedEmoji: {
    opacity: 1,
    transform: [{ scale: 1.25 }],
  },
  sliderWrapper: {
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  moodDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  selectedMoodEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  moodNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  moodMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emotionsScrollContainer: {
    flex: 1,
    marginBottom: 20,
    maxHeight: 320,
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  emotionChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    justifyContent: 'center',
    minHeight: 44,
  },
  emotionEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  emotionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    flex: 0.4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    flex: 0.55,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
});

export default MoodTracker;