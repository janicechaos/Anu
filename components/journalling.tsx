import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

type Mode = 'free' | 'prompted' | 'mood';
export interface Mood {
  emoji: string;
  name: string;
  color: string;
}

interface JournalScreenProps {
  selectedMoods?: Mood[];
  onJournalSaved?: () => void;
}

const defaultMoods: Mood[] = [
  { emoji: '😊', name: 'Happy', color: '#FFD700' },
  { emoji: '😌', name: 'Calm', color: '#87CEEB' },
  { emoji: '😔', name: 'Sad', color: '#4682B4' },
  { emoji: '😤', name: 'Frustrated', color: '#FF6B6B' },
  { emoji: '😴', name: 'Tired', color: '#DDA0DD' },
  { emoji: '🤔', name: 'Thoughtful', color: '#98FB98' },
  { emoji: '😰', name: 'Anxious', color: '#FFA07A' },
  { emoji: '🥰', name: 'Loved', color: '#FFB6C1' },
];

const JournalScreen: React.FC<JournalScreenProps> = ({ selectedMoods, onJournalSaved }) => {
  const [mode, setMode] = useState<Mode>('free');
  const [journalText, setJournalText] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);

  // Journal prompts for different categories
  const prompts = {
    reflection: [
      "What's one thing you learned about yourself today?",
      "Describe a moment today when you felt truly present.",
      "What would you tell your past self from a week ago?",
      "What are three things you're grateful for right now?",
      "How did you show kindness to yourself or others today?",
    ],
    growth: [
      "What challenge are you currently facing and how are you approaching it?",
      "What skill or habit would you like to develop?",
      "Describe a time when you overcame something difficult.",
      "What does success mean to you right now?",
      "How have you grown in the past month?",
    ],
    dreams: [
      "If you could do anything tomorrow, what would it be?",
      "Describe your ideal day in detail.",
      "What's a dream you've been putting off?",
      "Where do you see yourself in 5 years?",
      "What would you do if you knew you couldn't fail?",
    ],
    emotions: [
      "What emotion have you been feeling most lately?",
      "How do you typically handle stress?",
      "What makes you feel most alive?",
      "Describe a time when you felt completely at peace.",
      "What's something that always makes you smile?",
    ]
  };

  // Use selectedMoods if provided, otherwise default moods
  const moods: Mood[] = mode === 'mood' && selectedMoods && selectedMoods.length > 0 ? selectedMoods : defaultMoods;

  useEffect(() => {
    const words = journalText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [journalText]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const getRandomPrompt = (category: keyof typeof prompts) => {
    const categoryPrompts = prompts[category];
    return categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
  };

  const handlePromptMode = (category: keyof typeof prompts) => {
    setMode('prompted');
    setCurrentPrompt(getRandomPrompt(category));
    setJournalText('');
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSave = () => {
    if (!journalText.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }
    const entry = {
      text: journalText,
      mode: mode,
      prompt: currentPrompt,
      mood: selectedMood,
      wordCount: wordCount,
      date: new Date().toISOString(),
    };
    // Here you would save to your storage system
    console.log('Saving journal entry:', entry);
    setShowSaveAnimation(true);
    setTimeout(() => {
      setShowSaveAnimation(false);
      if (typeof onJournalSaved === 'function') {
        onJournalSaved();
      } else {
        Alert.alert('Saved!', 'Your journal entry has been saved.', [
          { text: 'New Entry', onPress: () => handleNewEntry() },
          { text: 'Continue', onPress: () => {} },
        ]);
      }
    }, 1500);
  };

  const handleNewEntry = () => {
    setJournalText('');
    setCurrentPrompt('');
    setSelectedMood(null);
    setMode('free');
  };

  const renderModeSelector = () => (
    <View style={styles.modeSelector}>
      <TouchableOpacity
        style={[styles.modeButton, mode === 'free' && styles.activeModeButton]}
        onPress={() => {
          setMode('free');
          setCurrentPrompt('');
        }}
      >
        <Text style={[styles.modeText, mode === 'free' && styles.activeModeText]}>
          Free Write
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modeButton, mode === 'prompted' && styles.activeModeButton]}
        onPress={() => {
          setMode('prompted');
          setCurrentPrompt('');
        }}
      >
        <Text style={[styles.modeText, mode === 'prompted' && styles.activeModeText]}>
          Prompted
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modeButton, mode === 'mood' && styles.activeModeButton]}
        onPress={() => {
          setMode('mood');
          setCurrentPrompt('');
        }}
      >
        <Text style={[styles.modeText, mode === 'mood' && styles.activeModeText]}>
          Mood
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPromptCategories = () => (
    <View style={styles.promptCategories}>
      <Text style={styles.promptTitle}>Choose a topic:</Text>
      <View style={styles.categoryGrid}>
        {Object.keys(prompts).map(category => (
          <TouchableOpacity
            key={category}
            style={styles.categoryButton}
            onPress={() => handlePromptMode(category as keyof typeof prompts)}
          >
            <Text style={styles.categoryText}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMoodSelector = () => (
    <View style={styles.moodContainer}>
      <Text style={styles.moodTitle}>How are you feeling?</Text>
      <View style={styles.moodGrid}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.moodButton,
              selectedMood?.name === mood.name && styles.selectedMoodButton,
              { backgroundColor: mood.color + '20' }
            ]}
            onPress={() => setSelectedMood(mood)}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodName}>{mood.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderWritingArea = () => (
    <Animated.View style={[styles.writingContainer, { transform: [{ scale: scaleAnim }] }]}> 
      {currentPrompt && (
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>{currentPrompt}</Text>
          <TouchableOpacity
            style={styles.newPromptButton}
            onPress={() => handlePromptMode(Object.keys(prompts)[Math.floor(Math.random() * 4)] as keyof typeof prompts)}
          >
            <Text style={styles.newPromptText}>New Prompt</Text>
          </TouchableOpacity>
        </View>
      )}
      <TextInput
        style={styles.textInput}
        placeholder={
          mode === 'free' 
            ? "Start writing your thoughts..." 
            : mode === 'prompted' 
              ? "Reflect on the prompt above..."
              : "Why are you feeling this way?"
        }
        value={journalText}
        onChangeText={setJournalText}
        multiline
        textAlignVertical="top"
        autoFocus={mode !== 'prompted'}
        placeholderTextColor="#fff"
      />
      <View style={styles.inputFooter}>
        <Text style={styles.wordCount}>{wordCount} words</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Entry</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={["#a78bfa", "#f472b6", "#6366f1"]}
      style={{ flex: 1 }}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Journal</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          {renderModeSelector()}
          {mode === 'prompted' && !currentPrompt && renderPromptCategories()}
          {mode === 'mood' && renderMoodSelector()}
          {(mode === 'free' || currentPrompt || selectedMood) && renderWritingArea()}
          {showSaveAnimation && (
            <View style={styles.saveAnimation}>
              <Text style={styles.saveAnimationText}>✨ Saved! ✨</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  date: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
  },
  modeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  activeModeButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  activeModeText: {
    color: '#333',
  },
  promptCategories: {
    marginBottom: 20,
  },
  promptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  categoryText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  moodContainer: {
    marginBottom: 20,
  },
  moodTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  moodButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    alignItems: 'center',
  },
  selectedMoodButton: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  moodEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  moodName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  writingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promptContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  promptText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  newPromptButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  newPromptText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  textInput: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 24,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  wordCount: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
  },
  saveButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  saveAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1,
  },
  saveAnimationText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default JournalScreen; 