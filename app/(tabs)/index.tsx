import AuthScreen from '@/components/AuthScreen';
import JournalScreen, { Mood } from '@/components/journalling';
import MoodSlider from '@/components/MoodTracker';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [authenticated, setAuthenticated] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<Mood[] | undefined>(undefined);

  const handleMoodComplete = (moods?: Mood[]) => {
    setSelectedMoods(moods);
    setShowJournal(true);
  };

  if (!authenticated) {
    return <AuthScreen onAuthSuccess={() => setAuthenticated(true)} />;
  }

  if (!showJournal) {
    return <MoodSlider onComplete={handleMoodComplete} />;
  }

  return <JournalScreen selectedMoods={selectedMoods} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
