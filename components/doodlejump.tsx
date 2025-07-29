import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Type definitions
interface Player {
  x: number;
  y: number;
  velocityY: number;
  velocityX: number;
  onGround: boolean;
}

interface Platform {
  x: number;
  y: number;
  id: number;
}

interface Camera {
  y: number;
}

const GRAVITY = 0.35;
const JUMP_FORCE = -18;
const PLATFORM_WIDTH = 80;
const PLATFORM_HEIGHT = 15;
const PLAYER_SIZE = 30;
const GAME_WIDTH = Dimensions.get('window').width > 400 ? 400 : Dimensions.get('window').width - 20;
const GAME_HEIGHT = 600;
const CAMERA_OFFSET = GAME_HEIGHT * 0.3;

const GRADIENT_COLORS = ['#a78bfa', '#f472b6', '#6366f1'] as const;

// Tree Icon Component
const TreeIcon = ({ size = 30 }: { size?: number }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Tree Canopy (Head) */}
      <View style={{
        width: size * 0.8,
        height: size * 0.6,
        backgroundColor: '#90EE90', // Light green
        borderRadius: size * 0.1,
        borderWidth: 1,
        borderColor: '#000',
        position: 'relative',
        marginBottom: 2
      }}>
        {/* Eyes */}
        <View style={{
          position: 'absolute',
          top: size * 0.15,
          left: size * 0.2,
          width: size * 0.15,
          height: size * 0.12,
          backgroundColor: '#000',
          borderRadius: size * 0.06,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <View style={{
            width: size * 0.04,
            height: size * 0.04,
            backgroundColor: '#fff',
            borderRadius: size * 0.02,
            position: 'absolute',
            top: 2,
            right: 2
          }} />
        </View>
        <View style={{
          position: 'absolute',
          top: size * 0.15,
          right: size * 0.2,
          width: size * 0.15,
          height: size * 0.12,
          backgroundColor: '#000',
          borderRadius: size * 0.06,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <View style={{
            width: size * 0.04,
            height: size * 0.04,
            backgroundColor: '#fff',
            borderRadius: size * 0.02,
            position: 'absolute',
            top: 2,
            right: 2
          }} />
        </View>
        {/* Smile */}
        <View style={{
          position: 'absolute',
          bottom: size * 0.15,
          left: '50%',
          width: size * 0.3,
          height: size * 0.08,
          borderBottomWidth: 2,
          borderBottomColor: '#000',
          borderRadius: size * 0.04,
          transform: [{ translateX: -size * 0.15 }]
        }} />
      </View>
      {/* Tree Trunk */}
      <View style={{
        width: size * 0.4,
        height: size * 0.4,
        backgroundColor: '#D2B48C', // Light brown
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: size * 0.05,
        position: 'relative'
      }}>
        {/* Roots/Feet */}
        <View style={{
          position: 'absolute',
          bottom: -size * 0.05,
          left: -size * 0.1,
          width: size * 0.15,
          height: size * 0.1,
          backgroundColor: '#D2B48C',
          borderWidth: 1,
          borderColor: '#000',
          borderRadius: size * 0.05
        }} />
        <View style={{
          position: 'absolute',
          bottom: -size * 0.05,
          right: -size * 0.1,
          width: size * 0.15,
          height: size * 0.1,
          backgroundColor: '#D2B48C',
          borderWidth: 1,
          borderColor: '#000',
          borderRadius: size * 0.05
        }} />
      </View>
    </View>
  );
};

const DoodleJump = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [keys, setKeys] = useState<{ left: boolean; right: boolean }>({ left: false, right: false });

  const gameLoopRef = useRef<number | null>(null);
  const playerRef = useRef<Player>({
    x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
    y: GAME_HEIGHT - 200,
    velocityY: 0,
    velocityX: 0,
    onGround: false
  });

  const cameraRef = useRef<Camera>({ y: 0 });
  const platformsRef = useRef<Platform[]>([]);

  const [player, setPlayer] = useState<Player>(playerRef.current);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [camera, setCamera] = useState<Camera>(cameraRef.current);

  // Generate initial platforms
  const generatePlatforms = (): Platform[] => {
    const newPlatforms: Platform[] = [];
    // Starting platform
    newPlatforms.push({
      x: GAME_WIDTH / 2 - PLATFORM_WIDTH / 2,
      y: GAME_HEIGHT - 100,
      id: 0
    });
    // Generate platforms going up
    for (let i = 1; i < 100; i++) {
      newPlatforms.push({
        x: Math.random() * (GAME_WIDTH - PLATFORM_WIDTH),
        y: GAME_HEIGHT - 100 - (i * 100 + Math.random() * 50),
        id: i
      });
    }
    return newPlatforms;
  };

  // Check collision between player and platforms
  const checkCollision = (playerX: number, playerY: number, platform: Platform): boolean => {
    return (
      playerX < platform.x + PLATFORM_WIDTH &&
      playerX + PLAYER_SIZE > platform.x &&
      playerY + PLAYER_SIZE > platform.y &&
      playerY + PLAYER_SIZE < platform.y + PLATFORM_HEIGHT + 10 &&
      playerRef.current.velocityY > 0
    );
  };

  // Game loop
  const gameLoop = () => {
    if (gameState !== 'playing') return;
    const currentPlayer = playerRef.current;
    let currentPlatforms = [...platformsRef.current];
    const currentCamera = cameraRef.current;
    // Handle horizontal movement
    if (keys.left) currentPlayer.velocityX = Math.max(currentPlayer.velocityX - 0.5, -8);
    if (keys.right) currentPlayer.velocityX = Math.min(currentPlayer.velocityX + 0.5, 8);
    if (!keys.left && !keys.right) {
      currentPlayer.velocityX *= 0.85; // Friction
    }
    // Apply velocities
    currentPlayer.x += currentPlayer.velocityX;
    currentPlayer.velocityY += GRAVITY;
    currentPlayer.y += currentPlayer.velocityY;
    // Screen wrapping
    if (currentPlayer.x + PLAYER_SIZE < 0) {
      currentPlayer.x = GAME_WIDTH;
    } else if (currentPlayer.x > GAME_WIDTH) {
      currentPlayer.x = -PLAYER_SIZE;
    }
    // Check platform collisions
    currentPlayer.onGround = false;
    currentPlatforms.forEach(platform => {
      if (checkCollision(currentPlayer.x, currentPlayer.y, platform)) {
        currentPlayer.velocityY = JUMP_FORCE;
        currentPlayer.onGround = true;
      }
    });
    // Camera follows player when going up
    const targetCameraY = currentPlayer.y - CAMERA_OFFSET;
    if (targetCameraY < currentCamera.y) {
      currentCamera.y = targetCameraY;
    }
    // Update score based on height
    const newScore = Math.max(0, Math.floor((GAME_HEIGHT - 200 - currentPlayer.y) / 10));
    setScore(newScore);
    // Generate more platforms as player goes higher
    const highestPlatform = Math.min(...currentPlatforms.map(p => p.y));
    if (highestPlatform > currentCamera.y - GAME_HEIGHT) {
      const lastId = Math.max(...currentPlatforms.map(p => p.id));
      for (let i = 1; i <= 15; i++) {
        currentPlatforms.push({
          x: Math.random() * (GAME_WIDTH - PLATFORM_WIDTH),
          y: highestPlatform - (i * 100 + Math.random() * 50),
          id: lastId + i
        });
      }
    }
    // Clean up old platforms that are far below the camera
    currentPlatforms = currentPlatforms.filter(platform => 
      platform.y > currentCamera.y - GAME_HEIGHT - 200
    );
    // Game over condition
    if (currentPlayer.y > currentCamera.y + GAME_HEIGHT + 100) {
      setGameState('gameOver');
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      return;
    }
    // Update refs and state
    platformsRef.current = currentPlatforms;
    setPlayer({ ...currentPlayer });
    setPlatforms(currentPlatforms);
    setCamera({ ...currentCamera });
  };

  // Touch controls for mobile
  const handleTouchLeft = (down: boolean) => setKeys(prev => ({ ...prev, left: down }));
  const handleTouchRight = (down: boolean) => setKeys(prev => ({ ...prev, right: down }));

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    playerRef.current = {
      x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
      y: GAME_HEIGHT - 200,
      velocityY: 0,
      velocityX: 0,
      onGround: false
    };
    cameraRef.current = { y: 0 };
    platformsRef.current = generatePlatforms();
    setPlayer(playerRef.current);
    setPlatforms(platformsRef.current);
    setCamera(cameraRef.current);
  };

  // Reset to menu
  const goToMenu = () => {
    setGameState('menu');
  };

  // Game loop effect
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(gameLoop, 16) as unknown as number;
    } else {
      if (gameLoopRef.current !== null) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
    return () => {
      if (gameLoopRef.current !== null) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState, keys]);

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <LinearGradient colors={GRADIENT_COLORS} style={rnStyles.container}>
        <View style={rnStyles.menuContainer}>
          <Text style={rnStyles.title}>Doodle Jump</Text>
          <Text style={rnStyles.highScore}>High Score: {highScore}</Text>
          <TouchableOpacity style={rnStyles.playButton} onPress={startGame}>
            <Text style={rnStyles.playButtonText}>PLAY</Text>
          </TouchableOpacity>
          <Text style={rnStyles.instructions}>
            Use the on-screen arrows to move left/right{"\n"}
            Jump on platforms to go higher!{"\n"}
            Go off the sides to wrap around!
          </Text>
        </View>
      </LinearGradient>
    );
  }

  // Game Over Screen
  if (gameState === 'gameOver') {
    return (
      <LinearGradient colors={GRADIENT_COLORS} style={rnStyles.container}>
        <View style={rnStyles.gameOverContainer}>
          <Text style={rnStyles.gameOverTitle}>Game Over!</Text>
          <Text style={rnStyles.finalScore}>Score: {score}</Text>
          <Text style={rnStyles.highScore}>High Score: {highScore}</Text>
          <TouchableOpacity style={rnStyles.playButton} onPress={startGame}>
            <Text style={rnStyles.playButtonText}>PLAY AGAIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={rnStyles.menuButton} onPress={goToMenu}>
            <Text style={rnStyles.menuButtonText}>MENU</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // Game Screen
  return (
    <LinearGradient colors={GRADIENT_COLORS} style={rnStyles.container}>
      <View style={rnStyles.gameArea}>
        {/* Score */}
        <Text style={rnStyles.scoreText}>Score: {score}</Text>
        {/* Touch controls for mobile */}
        <View style={rnStyles.touchControls}>
          <TouchableOpacity
            style={rnStyles.touchButton}
            onPressIn={() => handleTouchLeft(true)}
            onPressOut={() => handleTouchLeft(false)}
          >
            <Text style={rnStyles.touchButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={rnStyles.touchButton}
            onPressIn={() => handleTouchRight(true)}
            onPressOut={() => handleTouchRight(false)}
          >
            <Text style={rnStyles.touchButtonText}>→</Text>
          </TouchableOpacity>
        </View>
        {/* Game world */}
        <View style={rnStyles.gameWorld}>
          {/* Platforms */}
          {platforms
            .filter(platform =>
              platform.y - camera.y > -50 &&
              platform.y - camera.y < GAME_HEIGHT + 50
            )
            .map(platform => (
              <View
                key={platform.id}
                style={[
                  rnStyles.platform,
                  {
                    left: platform.x,
                    top: platform.y - camera.y,
                    position: 'absolute',
                  },
                ]}
              />
            ))}
          {/* Player */}
          <View
            style={[
              rnStyles.player,
              {
                left: player.x,
                top: player.y - camera.y,
                position: 'absolute',
                backgroundColor: 'transparent',
                borderWidth: 0,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <TreeIcon size={PLAYER_SIZE} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const rnStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    alignItems: 'center',
    padding: 20,
  },
  gameOverContainer: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gameOverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  highScore: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
    textShadowColor: '#6366f1',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  finalScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: '#f472b6',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playButton: {
    backgroundColor: '#6366f1',
    borderRadius: 25,
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  playButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    backgroundColor: '#a78bfa',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginTop: 10,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 16,
    color: '#fff',
    marginTop: 30,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: '#6366f1',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameArea: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  scoreText: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 100,
    textShadowColor: '#6366f1',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  touchControls: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    flexDirection: 'row',
    gap: 20,
    zIndex: 100,
    transform: [{ translateX: -60 }],
  },
  touchButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#a78bfa',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  touchButtonText: {
    color: '#a78bfa',
    fontSize: 32,
    fontWeight: 'bold',
  },
  gameWorld: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  platform: {
    width: PLATFORM_WIDTH,
    height: PLATFORM_HEIGHT,
    backgroundColor: '#60a5fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  player: {
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DoodleJump;