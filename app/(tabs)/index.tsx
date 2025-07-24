import AuthScreen from '@/components/AuthScreen';
import DoodleJump from '@/components/doodlejump';
import JournalScreen, { Mood } from '@/components/journalling';
import MoodSlider from '@/components/MoodTracker';
import TetrisGame from '@/components/tetris';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [authenticated, setAuthenticated] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<Mood[] | undefined>(undefined);
  const [showGamePrompt, setShowGamePrompt] = useState(false);
  const [showDoodleJump, setShowDoodleJump] = useState(false);
  const [showTetris, setShowTetris] = useState(false);

  const handleMoodComplete = (moods?: Mood[]) => {
    setSelectedMoods(moods);
    setShowJournal(true);
  };

  const handleJournalSaved = () => {
    setShowJournal(false);
    setShowGamePrompt(true);
  };

  const handlePlayDoodleJump = () => {
    setShowGamePrompt(false);
    setShowDoodleJump(true);
  };
  const handlePlayTetris = () => {
    setShowGamePrompt(false);
    setShowTetris(true);
  };

  const handleGameExit = () => {
    setShowDoodleJump(false);
    setShowTetris(false);
    setShowJournal(false);
    setShowGamePrompt(false);
    setSelectedMoods(undefined);
  };

  if (!authenticated) {
    return <AuthScreen onAuthSuccess={() => setAuthenticated(true)} />;
  }

  if (showDoodleJump) {
    return (
      <View style={{ flex: 1, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
        <DoodleJump />
        <TouchableOpacity style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#fff', padding: 10, borderRadius: 8 }} onPress={handleGameExit}>
          <Text style={{ color: '#222', fontWeight: 'bold' }}>Exit Game</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (showTetris) {
    return (
      <View style={{ flex: 1, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
        <TetrisGame />
        <TouchableOpacity style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#fff', padding: 10, borderRadius: 8 }} onPress={handleGameExit}>
          <Text style={{ color: '#222', fontWeight: 'bold' }}>Exit Game</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (showGamePrompt) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#a78bfa' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 30 }}>Let's play a game!</Text>
        <TouchableOpacity style={{ backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 20 }} onPress={handlePlayDoodleJump}>
          <Text style={{ fontSize: 20, color: '#a78bfa', fontWeight: 'bold' }}>Play Doodle Jump</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#fff', padding: 20, borderRadius: 16 }} onPress={handlePlayTetris}>
          <Text style={{ fontSize: 20, color: '#a78bfa', fontWeight: 'bold' }}>Play Tetris</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!showJournal) {
    return <MoodSlider onComplete={handleMoodComplete} />;
  }

  return <JournalScreen selectedMoods={selectedMoods} onJournalSaved={handleJournalSaved} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
