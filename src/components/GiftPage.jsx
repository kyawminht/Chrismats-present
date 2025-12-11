import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Container,
  LinearProgress,
  Slide,
  Grow,
  Fade,
  useTheme,
  ThemeProvider,
  createTheme,
  IconButton
} from '@mui/material';
import Confetti from 'react-confetti';
import Snowfall from 'react-snowfall'; // Import the snowfall component
import { useSound } from 'use-sound';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { GREETINGS } from '../config/greetings';
import { SOUND_MAP } from '../soundMap';

const GiftPage = () => {
  const { recipientId } = useParams();
  const baseTheme = useTheme();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const [animatedText, setAnimatedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Find recipient data
  const recipient = GREETINGS.find(g => g.id === recipientId);
  
  // Set up sound (using placeholder URLs from soundMap)
  const [playSound, { stop, pause }] = useSound(
    SOUND_MAP[recipient?.sound]?.url || SOUND_MAP.JINGLE.url,
    {
      volume: SOUND_MAP[recipient?.sound]?.volume || 0.5,
      onplay: () => setIsPlaying(true),
      onend: () => setIsPlaying(false),
      onpause: () => setIsPlaying(false),
    }
  );
  
  // Create dynamic theme based on recipient's first confetti color
  const dynamicTheme = createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      primary: {
        main: recipient?.confettiColors[0] || '#B71C1C',
        light: recipient?.confettiColors[1] || '#1B5E20',
      },
    },
  });
  
  // Toggle sound
  const handleSoundToggle = () => {
    if (isPlaying) {
      pause();
      setIsSoundOn(false);
    } else {
      if (isSoundOn) {
        playSound();
      }
      setIsSoundOn(!isSoundOn);
    }
  };
  
  // Initial effects on mount
  useEffect(() => {
    if (!recipient) return;
    
    // Start the experience
    playSound();
    setShowConfetti(true);
    
    // Show card after a brief delay
    const cardTimer = setTimeout(() => {
      setShowCard(true);
    }, 500);
    
    // Auto-restart sound if it ends (for looping effect)
    const soundRestartTimer = setInterval(() => {
      if (isSoundOn && !isPlaying) {
        playSound();
      }
    }, 7000); // Match sound duration
    
    return () => {
      clearTimeout(cardTimer);
      clearInterval(soundRestartTimer);
      stop();
    };
  }, [recipient, playSound, stop, isSoundOn, isPlaying]);
  
  // Text animation effect
  useEffect(() => {
    if (!recipient || !showCard) return;
    
    const message = recipient.message;
    if (textIndex < message.length) {
      const timer = setTimeout(() => {
        setAnimatedText(message.substring(0, textIndex + 1));
        setTextIndex(textIndex + 1);
      }, 30);
      
      return () => clearTimeout(timer);
    }
  }, [textIndex, showCard, recipient]);
  
  // Handle window resize for confetti and snowfall
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle invalid recipient
  if (!recipient) {
    return (
      <Paper elevation={24} sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
        <Typography variant="h5" color="error" gutterBottom>
          🎁 Oops!
        </Typography>
        <Typography variant="body1">
          We couldn't find your personalized gift. 
          Please check your URL or contact Santa!
        </Typography>
      </Paper>
    );
  }
  
  return (
    <ThemeProvider theme={dynamicTheme}>
      {/* Persistent Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          colors={recipient.confettiColors}
          recycle={true} // Keep recycling confetti
          numberOfPieces={150}
          gravity={0.08}
          wind={0.01}
          initialVelocityX={3}
          initialVelocityY={3}
          opacity={0.9}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
        />
      )}
      
      {/* NEW: Snowfall Effect */}
      <Snowfall
        // Match the winter aesthetic - white snowflakes
        color="#ffffff"
        // Apply a subtle blue tint for a cold, wintery feel
        snowflakeCount={120} // Number of snowflakes
        radius={[0.5, 3.0]} // Range of snowflake sizes
        speed={[0.5, 1.5]} // Range of falling speeds
        wind={[-0.2, 0.3]} // Gentle wind effect
        rotationSpeed={[-0.5, 0.5]} // Snowflake rotation
        opacity={[0.4, 0.9]} // Snowflake transparency range
        // Style to cover the entire screen
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 900, // Below confetti but above background
        }}
      />
      
    {/* Sound Control Button with YouTube-style Toggle */}
{/* Sound Control Button - FIXED LOGIC */}
<Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 2000 }}>
  <IconButton
    onClick={handleSoundToggle}
    sx={{
      backgroundColor: !isSoundOn ? 'rgba(255,0,0,0.3)' : 'rgba(0,0,0,0.7)',
      color: 'white',
      border: '1px solid',
      borderColor: !isSoundOn ? '#FF0000' : 'rgba(255,255,255,0.3)',
      position: 'relative',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: !isSoundOn ? 'rgba(255,0,0,0.5)' : 'rgba(0,0,0,0.9)',
        transform: 'scale(1.1)',
      },
    }}
  >
    {/* SHOW MUTED ICON WHEN SOUND IS OFF */}
    {isSoundOn ? (
      // MUTED: Speaker with red slash
      <>
        <VolumeOffIcon />
        <Box
         
        />
      </>
    ) : (
      // UNMUTED: Normal speaker icon
      <VolumeUpIcon />
    )}
  </IconButton>
  
  {/* Show "Tap to unmute" only when sound is OFF (muted) */}
  {isSoundOn && (
    <Box
      sx={{
        position: 'absolute',
        top: '50px',
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        animation: 'fadeIn 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 2001,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-6px',
          right: '10px',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: '6px solid rgba(0,0,0,0.9)',
        }
      }}
    >
      Tap to unmute
    </Box>
  )}
</Box>

      
      <Container maxWidth="md">
        {/* Main content with staggered animations */}
        <Fade in={showCard} timeout={1000}>
          <Box sx={{ position: 'relative' }}>
            {/* Festive Icon */}
            <Grow in={showCard} timeout={1500}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h1" sx={{ fontSize: '4rem' }}>
                  {recipient.icon}
                </Typography>
              </Box>
            </Grow>
            
            {/* Main Card */}
            <Slide in={showCard} direction="up" timeout={800}>
              <Paper
                elevation={24}
                sx={{
                  p: { xs: 3, md: 5 },
                  background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
                  border: `3px solid ${recipient.confettiColors[0]}`,
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(30, 30, 30, 0.85)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${recipient.confettiColors.join(', ')})`,
                  },
                }}
              >
                {/* Recipient Name */}
                <Typography
                  variant="h3"
                  align="center"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    background: `linear-gradient(45deg, ${recipient.confettiColors[0]}, ${recipient.confettiColors[1]})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 4,
                    textShadow: '0 0 20px rgba(255,255,255,0.1)',
                  }}
                >
                  Merry Christmas, {recipient.recipient}!
                </Typography>
                
                {/* Animated Message */}
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderLeft: `4px solid ${recipient.confettiColors[2]}`,
                    mb: 3,
                    backdropFilter: 'blur(5px)',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      minHeight: 150,
                      fontStyle: 'italic',
                      color: 'rgba(255,255,255,0.95)',
                    }}
                  >
                    {animatedText}
                    <span style={{ 
                      animation: 'blink 1s infinite',
                      color: recipient.confettiColors[0],
                      fontWeight: 'bold'
                    }}>|</span>
                  </Typography>
                </Paper>
                
                {/* Signature */}
                <Fade in={textIndex >= recipient.message.length} timeout={1000}>
                  <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="body2" color="text.secondary">
                      With warmest holiday wishes,
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      🎅 Your friend kyaw 🎅
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      Enjoy the festive snowfall along with the celebration!
                    </Typography>
                  </Box>
                </Fade>
              </Paper>
            </Slide>
          </Box>
        </Fade>
      </Container>
      
      {/* Add CSS for blinking cursor */}
      <style jsx="true">{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        /* Confetti styling enhancement */
        .confetti-canvas {
          pointer-events: none;
        }
      `}</style>
    </ThemeProvider>
  );
};

export default GiftPage;