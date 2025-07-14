import ActivityChoice from '@/components/ActivityChoice';
import MoodSlider from '@/components/MoodTracker';
import PeriodCalendar from '@/components/PeriodCalendar';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showActivityChoice, setShowActivityChoice] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);

  const handleActivityChoice = (choice: 'mental' | 'physical' | 'both') => {
    setSelectedActivity(choice);
    // You can add navigation logic here if needed
    console.log('Selected activity:', choice);
  };

  const handleMoodComplete = () => {
    setShowActivityChoice(true);
  };

  const handlePeriodComplete = () => {
    setShowMoodTracker(true);
  };

  // Show PeriodCalendar first
  if (!showMoodTracker) {
    return <PeriodCalendar onComplete={handlePeriodComplete} />;
  }

  // Then show mood tracker
  if (!showActivityChoice) {
    return <MoodSlider onComplete={handleMoodComplete} />;
  }

  // Finally show activity choice
  return <ActivityChoice onChoice={handleActivityChoice} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
