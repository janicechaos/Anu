import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25;
const GRADIENT_COLORS = ['#a78bfa', '#f472b6', '#6366f1'];

const PIECES = {
  I: [
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]]
  ],
  O: [
    [[1, 1], [1, 1]]
  ],
  T: [
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]],
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]]
  ],
  S: [
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]]
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1], [1, 1], [1, 0]]
  ],
  J: [
    [[1, 0, 0], [1, 1, 1]],
    [[1, 1], [1, 0], [1, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[0, 1], [0, 1], [1, 1]]
  ],
  L: [
    [[0, 0, 1], [1, 1, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1], [0, 1], [0, 1]]
  ]
};

const PIECE_COLORS = {
  I: '#60e6fa',
  O: '#f9f871',
  T: '#b983f7',
  S: '#7cf7a0',
  Z: '#fa7c7c',
  J: '#7ca6fa',
  L: '#fac27c'
};

const createEmptyBoard = () => Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
const getRandomPiece = () => {
  const pieces = Object.keys(PIECES);
  return pieces[Math.floor(Math.random() * pieces.length)];
};

export default function TetrisGame() {
  const [board, setBoard] = useState(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const spawnNewPiece = useCallback(() => {
    const piece = getRandomPiece();
    const startX = Math.floor(BOARD_WIDTH / 2) - 1;
    const startY = 0;
    setCurrentPiece(piece);
    setCurrentPosition({ x: startX, y: startY });
    setCurrentRotation(0);
    if (!isValidPosition(board, piece, startX, startY, 0)) {
      setGameOver(true);
    }
  }, [board]);

  const isValidPosition = (board, piece, x, y, rotation) => {
    if (!piece) return false;
    const shape = PIECES[piece][rotation % PIECES[piece].length];
    for (let py = 0; py < shape.length; py++) {
      for (let px = 0; px < shape[py].length; px++) {
        if (shape[py][px]) {
          const newX = x + px;
          const newY = y + py;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placePiece = useCallback(() => {
    if (!currentPiece) return;
    const newBoard = board.map(row => [...row]);
    const shape = PIECES[currentPiece][currentRotation % PIECES[currentPiece].length];
    for (let py = 0; py < shape.length; py++) {
      for (let px = 0; px < shape[py].length; px++) {
        if (shape[py][px]) {
          const newX = currentPosition.x + px;
          const newY = currentPosition.y + py;
          if (newY >= 0) {
            newBoard[newY][newX] = currentPiece;
          }
        }
      }
    }
    setBoard(newBoard);
    let linesCleared = 0;
    const clearedBoard = newBoard.filter(row => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++;
        return false;
      }
      return true;
    });
    while (clearedBoard.length < BOARD_HEIGHT) {
      clearedBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    if (linesCleared > 0) {
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      setLevel(Math.floor((lines + linesCleared) / 10) + 1);
    }
    spawnNewPiece();
  }, [board, currentPiece, currentPosition, currentRotation, level, lines, spawnNewPiece]);

  const movePiece = useCallback((dx, dy) => {
    if (!currentPiece || gameOver || isPaused) return;
    const newX = currentPosition.x + dx;
    const newY = currentPosition.y + dy;
    if (isValidPosition(board, currentPiece, newX, newY, currentRotation)) {
      setCurrentPosition({ x: newX, y: newY });
    } else if (dy > 0) {
      placePiece();
    }
  }, [board, currentPiece, currentPosition, currentRotation, gameOver, isPaused, placePiece]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const newRotation = (currentRotation + 1) % PIECES[currentPiece].length;
    if (isValidPosition(board, currentPiece, currentPosition.x, currentPosition.y, newRotation)) {
      setCurrentRotation(newRotation);
    }
  }, [board, currentPiece, currentPosition, currentRotation, gameOver, isPaused]);

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    let newY = currentPosition.y;
    while (isValidPosition(board, currentPiece, currentPosition.x, newY + 1, currentRotation)) {
      newY++;
    }
    setCurrentPosition(pos => {
      // Place the piece immediately after moving
      placePieceWithPosition(currentPosition.x, newY);
      return { ...pos, y: newY };
    });
  }, [board, currentPiece, currentPosition, currentRotation, gameOver, isPaused]);

  // Helper to place piece at a specific position
  const placePieceWithPosition = (x, y) => {
    if (!currentPiece) return;
    const newBoard = board.map(row => [...row]);
    const shape = PIECES[currentPiece][currentRotation % PIECES[currentPiece].length];
    for (let py = 0; py < shape.length; py++) {
      for (let px = 0; px < shape[py].length; px++) {
        if (shape[py][px]) {
          const newX = x + px;
          const newY = y + py;
          if (newY >= 0) {
            newBoard[newY][newX] = currentPiece;
          }
        }
      }
    }
    setBoard(newBoard);
    let linesCleared = 0;
    const clearedBoard = newBoard.filter(row => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++;
        return false;
      }
      return true;
    });
    while (clearedBoard.length < BOARD_HEIGHT) {
      clearedBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    if (linesCleared > 0) {
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      setLevel(Math.floor((lines + linesCleared) / 10) + 1);
    }
    spawnNewPiece();
  };

  const startGame = () => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused || !currentPiece) return;
    const dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    const timer = setInterval(() => {
      movePiece(0, 1);
    }, dropInterval);
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, isPaused, currentPiece, level, movePiece]);

  // Initialize first piece when game starts
  useEffect(() => {
    if (gameStarted && !currentPiece && !gameOver) {
      spawnNewPiece();
    }
  }, [gameStarted, currentPiece, gameOver, spawnNewPiece]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    if (currentPiece) {
      const shape = PIECES[currentPiece][currentRotation % PIECES[currentPiece].length];
      for (let py = 0; py < shape.length; py++) {
        for (let px = 0; px < shape[py].length; px++) {
          if (shape[py][px]) {
            const newX = currentPosition.x + px;
            const newY = currentPosition.y + py;
            if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
              displayBoard[newY][newX] = currentPiece;
            }
          }
        }
      }
    }
    return displayBoard.map((row, y) => (
      <View key={y} style={styles.row}>
        {row.map((cell, x) => (
          <View
            key={x}
            style={[
              styles.cell,
              {
                backgroundColor: cell ? PIECE_COLORS[cell] : 'rgba(255,255,255,0.08)',
                borderColor: cell ? '#fff' : 'rgba(255,255,255,0.15)'
              }
            ]}
          />
        ))}
      </View>
    ));
  };

  return (
    <LinearGradient colors={GRADIENT_COLORS} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TETRIS</Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>Score: {score}</Text>
          <Text style={styles.stat}>Level: {level}</Text>
          <Text style={styles.stat}>Lines: {lines}</Text>
        </View>
      </View>
      <View style={styles.gameArea}>
        <View style={styles.board}>{renderBoard()}</View>
        {gameOver && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverText}>GAME OVER</Text>
            <TouchableOpacity style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}
        {!gameStarted && !gameOver && (
          <View style={styles.overlay}>
            <Text style={styles.welcomeText}>Welcome to Tetris!</Text>
            <Text style={styles.instructions}>
              Use the on-screen controls to play
            </Text>
            <TouchableOpacity style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>Start Game</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.controlButton} onPress={() => movePiece(-1, 0)}>
            <Text style={styles.controlButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={rotatePiece}>
            <Text style={styles.controlButtonText}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={() => movePiece(1, 0)}>
            <Text style={styles.controlButtonText}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.controlButton} onPress={() => movePiece(0, 1)}>
            <Text style={styles.controlButtonText}>↓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={dropPiece}>
            <Text style={styles.controlButtonText}>Drop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={() => setIsPaused(!isPaused)}>
            <Text style={styles.controlButtonText}>{isPaused ? '▶' : '⏸'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.buttonText}>Reset Game</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: '#6366f1',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  stat: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: '#6366f1',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameArea: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 8,
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  board: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 2,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderRadius: 4,
    margin: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 18,
  },
  gameOverText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: '#fa7c7c',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: '#60e6fa',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  instructions: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: '#6366f1',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  controls: {
    alignItems: 'center',
    marginTop: 8,
  },
  controlRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  controlButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  controlButtonText: {
    color: '#6366f1',
    fontWeight: 'bold',
    fontSize: 22,
  },
  resetButton: {
    backgroundColor: '#a78bfa',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});