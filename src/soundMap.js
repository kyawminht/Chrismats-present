// Sound mapping file - Placeholder for actual sound file imports
// In a real application, you would import actual sound files here
// Example with use-sound hook:

// import jingleSound from '../assets/sounds/jingle.mp3';
// import bellsSound from '../assets/sounds/bells.mp3';
// import choirSound from '../assets/sounds/choir.mp3';

// Updated src/soundMap.js
const SOUND_MAP = {
  JINGLE: {
    url: '/wish.mp3', // Note: starts with forward slash
    volume: 0.5,
  },
  BELLS: {
    url: '/bells.mp3',
    volume: 0.4,
  },
  CHOIR: {
    url: '/last-chrismat.mp3',
    volume: 0.6,
  },
  SANTA: {
    url: '/santa.mp3',
    volume: 0.6,
  },
   HIGH: {
    url: '/high.mp3',
    volume: 0.6,
  },
  
};

export { SOUND_MAP };