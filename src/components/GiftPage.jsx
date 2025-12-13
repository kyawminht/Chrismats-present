import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Container,
  Slide,
  Grow,
  Fade,
  useTheme,
  ThemeProvider,
  createTheme,
  IconButton,
  useMediaQuery, // Add this import
  Button
} from '@mui/material';
import Confetti from 'react-confetti';
import Snowfall from 'react-snowfall';
import { useSound } from 'use-sound';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { GREETINGS } from '../config/greetings';
import { SOUND_MAP } from '../soundMap';
import { Refresh, RefreshOutlined } from '@mui/icons-material';

const GiftPage = () => {
  const { recipientId } = useParams();
  const baseTheme = useTheme();
  const isMobile = useMediaQuery(baseTheme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(baseTheme.breakpoints.between('sm', 'md'));
  
  // State declarations
  const [showConfetti, setShowConfetti] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const [animatedText, setAnimatedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [greetingVersion, setGreetingVersion] = useState(0);
  
  // Friend options for random greetings
  const friendOptions = {
    messages: [
      "Wishing you a magical Christmas season filled with joy, peace, and wonderful memories! May your holidays be as special as you are!",
      "Sending warmest Christmas cheer your way! Hope your day is filled with laughter, good food, and the company of loved ones.",
      "May the magic of Christmas fill every corner of your heart and home. Wishing you a season of blessings and happy moments!",
      "Thinking of you this holiday season and sending a sleigh-full of good wishes your way! Merry Christmas!",
      "Hope your Christmas is sparkling with moments of love, laughter, and goodwill. You deserve all the happiness this season brings!"
    ],
    sounds: ['JINGLE', 'BELLS', 'CHOIR', 'SANTA', 'HIGH'],
    icons: ['🎄', '🎅', '🤶', '🦌', '⭐', '✨', '🎁', '🔔', '⛄', '🌟'],
    colorSchemes: [
      ['#B71C1C', '#1B5E20', '#FFD700', '#0D47A1', '#4A148C'],
      ['#4A148C', '#880E4F', '#006064', '#BF360C', '#33691E'],
      ['#0D47A1', '#F57C00', '#1B5E20', '#D81B60', '#311B92'],
      ['#880E4F', '#004D40', '#B71C1C', '#1A237E', '#FF6F00'],
      ['#00695C', '#F57C00', '#4527A0', '#C62828', '#558B2F']
    ]
  };

  // Generate random friend greeting
  const generateRandomFriendGreeting = () => {
    const randomMessage = friendOptions.messages[Math.floor(Math.random() * friendOptions.messages.length)];
    const randomSound = friendOptions.sounds[Math.floor(Math.random() * friendOptions.sounds.length)];
    const randomIcon = friendOptions.icons[Math.floor(Math.random() * friendOptions.icons.length)];
    const randomColors = friendOptions.colorSchemes[Math.floor(Math.random() * friendOptions.colorSchemes.length)];
    
    return {
      id: 'friends',
      recipient: 'My Facebook Friend',
      sound: randomSound,
      message: randomMessage,
      confettiColors: randomColors,
      niceScore: 90 + Math.floor(Math.random() * 10),
      icon: randomIcon,
    };
  };

  // Determine recipient using useMemo
  const recipient = useMemo(() => {
    if (recipientId === 'friends') {
      // Generate fresh random greeting
      return generateRandomFriendGreeting();
    } else {
      // Find in your original GREETINGS array
      return GREETINGS.find(g => g.id === recipientId);
    }
  }, [recipientId, greetingVersion]); // Re-run when recipientId or version changes

  // Set up sound (must be called BEFORE any conditional returns)
  const [playSound, { stop, pause }] = useSound(
    recipient?.sound ? SOUND_MAP[recipient.sound]?.url : SOUND_MAP.JINGLE.url,
    {
      volume: recipient?.sound ? SOUND_MAP[recipient.sound]?.volume : 0.5,
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
        main: recipient?.confettiColors?.[0] || '#B71C1C',
        light: recipient?.confettiColors?.[1] || '#1B5E20',
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

  // Handle new random greeting
  const handleNewGreeting = () => {
    setGreetingVersion(prev => prev + 1);
    setAnimatedText('');
    setTextIndex(0);
    setShowCard(false);
    setTimeout(() => setShowCard(true), 300);
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

  // Text animation effect with mobile optimization
  useEffect(() => {
    if (!recipient || !showCard) return;
    
    const message = recipient.message;
    if (textIndex < message.length) {
      const timer = setTimeout(() => {
        setAnimatedText(message.substring(0, textIndex + 1));
        setTextIndex(textIndex + 1);
      }, isMobile ? 40 : 30); // Slower typing on mobile
      
      return () => clearTimeout(timer);
    }
  }, [textIndex, showCard, recipient, isMobile]);

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

  // Handle invalid recipient (AFTER all hooks)
  if (!recipient) {
    return (
      <Paper elevation={24} sx={{ 
        p: isMobile ? 3 : 4, 
        textAlign: 'center', 
        maxWidth: isMobile ? '90%' : 500,
        mx: 'auto',
        my: isMobile ? 4 : 0
      }}>
        <Typography variant={isMobile ? "h6" : "h5"} color="error" gutterBottom>
          🎁 Oops!
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"}>
          We couldn't find your personalized gift. 
          Please check your URL or contact Santa!
        </Typography>
      </Paper>
    );
  }

  return (
    <ThemeProvider theme={dynamicTheme}>
      {/* Persistent Confetti Effect with mobile optimization */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          colors={recipient.confettiColors}
          recycle={true}
          numberOfPieces={isMobile ? 100 : 150}
          gravity={0.08}
          wind={0.01}
          initialVelocityX={isMobile ? 2 : 3}
          initialVelocityY={isMobile ? 2 : 3}
          opacity={0.9}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
        />
      )}
      
      {/* Snowfall Effect with mobile optimization */}
      <Snowfall
        color="#ffffff"
        snowflakeCount={isMobile ? 80 : 120}
        radius={[0.5, isMobile ? 2.5 : 3.0]}
        speed={[0.5, 1.5]}
        wind={[-0.2, 0.3]}
        rotationSpeed={[-0.5, 0.5]}
        opacity={[0.4, 0.9]}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 900,
        }}
      />
      
      {/* Sound Control Button - Responsive */}
      <Box sx={{ position: 'fixed', top: isMobile ? 10 : 20, right: isMobile ? 10 : 20, zIndex: 2000 }}>
        <IconButton
          onClick={handleSoundToggle}
          sx={{
            backgroundColor: !isSoundOn ? 'rgba(255,0,0,0.3)' : 'rgba(0,0,0,0.7)',
            color: 'white',
            border: '1px solid',
            borderColor: !isSoundOn ? '#FF0000' : 'rgba(255,255,255,0.3)',
            position: 'relative',
            transition: 'all 0.3s ease',
            width: isMobile ? 40 : 48,
            height: isMobile ? 40 : 48,
            '&:hover': {
              backgroundColor: !isSoundOn ? 'rgba(255,0,0,0.5)' : 'rgba(0,0,0,0.9)',
              transform: isMobile ? 'scale(1.05)' : 'scale(1.1)',
            },
          }}
        >
          {/* SHOW MUTED ICON WHEN SOUND IS OFF */}
          {isSoundOn ? (
            <>
              <VolumeOffIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
            </>
          ) : (
            <VolumeUpIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
          )}
        </IconButton>
        
        {/* Show "Tap to unmute" only when sound is OFF (muted) */}
        {isSoundOn && (
          <Box
            sx={{
              position: 'absolute',
              top: isMobile ? '45px' : '50px',
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.9)',
              color: 'white',
              padding: isMobile ? '6px 10px' : '8px 12px',
              borderRadius: '4px',
              fontSize: isMobile ? '12px' : '14px',
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
      
      {/* Responsive Container */}
      <Container 
        maxWidth={isMobile ? false : "md"} 
        sx={{ 
          px: isMobile ? 2 : 3,
          py: isMobile ? 2 : 4
        }}
      >
        {/* Main content with staggered animations */}
        <Fade in={showCard} timeout={1000}>
          <Box sx={{ position: 'relative' }}>
            {/* Festive Icon - Responsive size */}
            <Grow in={showCard} timeout={1500}>
              <Box sx={{ textAlign: 'center', mb: isMobile ? 2 : 3 }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: isMobile ? '3rem' : isTablet ? '3.5rem' : '4rem',
                    lineHeight: 1.2
                  }}
                >
                  {recipient.icon}
                </Typography>
              </Box>
            </Grow>
            
            {/* Main Card - Responsive sizing */}
            <Slide in={showCard} direction="up" timeout={800}>
              <Paper
                elevation={isMobile ? 12 : 24}
                sx={{
                  p: isMobile ? 2.5 : { xs: 3, md: 5 },
                  background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
                  border: `${isMobile ? '2px' : '3px'} solid ${recipient.confettiColors[0]}`,
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(30, 30, 30, 0.85)',
                  borderRadius: isMobile ? 3 : 4,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: isMobile ? '3px' : '4px',
                    background: `linear-gradient(90deg, ${recipient.confettiColors.join(', ')})`,
                  },
                }}
              >
                {/* Recipient Name - Responsive typography */}
                <Typography
                  variant={isMobile ? "h4" : isTablet ? "h3" : "h3"}
                  align="center"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    background: `linear-gradient(45deg, ${recipient.confettiColors[0]}, ${recipient.confettiColors[1]})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: isMobile ? 3 : 4,
                    textShadow: '0 0 20px rgba(255,255,255,0.1)',
                    lineHeight: 1.2,
                    fontSize: isMobile ? '1.75rem' : isTablet ? '2.25rem' : '2.5rem',
                  }}
                >
                  Merry Christmas, {recipient.recipient}!
                </Typography>
                
                {/* Animated Message - Responsive sizing */}
                <Paper
                  elevation={2}
                  sx={{
                    p: isMobile ? 2 : 3,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderLeft: `${isMobile ? '3px' : '4px'} solid ${recipient.confettiColors[2]}`,
                    mb: isMobile ? 2 : 3,
                    backdropFilter: 'blur(5px)',
                    borderRadius: isMobile ? 2 : 3,
                  }}
                >
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    sx={{
                      lineHeight: isMobile ? 1.6 : 1.8,
                      minHeight: isMobile ? 120 : 150,
                      fontStyle: 'italic',
                      color: 'rgba(255,255,255,0.95)',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                    }}
                  >
                    {animatedText}
                    <span style={{ 
                      animation: 'blink 1s infinite',
                      color: recipient.confettiColors[0],
                      fontWeight: 'bold',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                    }}>|</span>
                  </Typography>
                </Paper>
                
                
                {/* Signature - Responsive sizing */}
                <Fade in={textIndex >= recipient.message.length} timeout={1000}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    mt: isMobile ? 3 : 4, 
                    pt: isMobile ? 2 : 3, 
                    borderTop: '1px solid rgba(255,255,255,0.1)' 
                  }}>
                    <Typography 
                      variant={isMobile ? "caption" : "body2"} 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                    >
                      With warmest holiday wishes,
                    </Typography>
                    <Typography 
                      variant={isMobile ? "subtitle1" : "h6"} 
                      color="primary" 
                      sx={{ 
                        mt: 1,
                        fontSize: isMobile ? '1rem' : '1.25rem'
                      }}
                    >
                      🎅 kyaw 🎅
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        mt: isMobile ? 1.5 : 2, 
                        display: 'block',
                        fontSize: isMobile ? '0.7rem' : '0.75rem'
                      }}
                    >
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

