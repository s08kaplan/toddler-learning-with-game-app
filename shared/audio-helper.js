class AudioHelper {
  static isMuted = false;
  static audioCtx = null;
  static currentUtterance = null; 
  static voicesLoaded = false;

  static initAudio() {
   
    if (!AudioHelper.audioCtx) {
      AudioHelper.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (AudioHelper.audioCtx.state === 'suspended') {
      AudioHelper.audioCtx.resume();
    }

    // 2. Pre-load SpeechSynthesis Voices
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          AudioHelper.voicesLoaded = true;
        }
      };

      loadVoices();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  static speak(text, rate = 0.85) {
    if (AudioHelper.isMuted) return;

    if ('speechSynthesis' in window) {
      
      AudioHelper.initAudio();

      // Clear previous queue and resume if stuck
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

    
      AudioHelper.currentUtterance = new SpeechSynthesisUtterance(text);
      AudioHelper.currentUtterance.rate = rate;
      AudioHelper.currentUtterance.pitch = 1.2;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const englishVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (englishVoice) {
          AudioHelper.currentUtterance.voice = englishVoice;
        }
      }

      setTimeout(() => {
        window.speechSynthesis.speak(AudioHelper.currentUtterance);
      }, 50);
    }
  }

  static playTone(freq = 440, type = 'sine', duration = 0.2) {
    if (AudioHelper.isMuted) return;
    try {
      AudioHelper.initAudio();
      const osc = AudioHelper.audioCtx.createOscillator();
      const gain = AudioHelper.audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(AudioHelper.audioCtx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, AudioHelper.audioCtx.currentTime + duration);
      osc.stop(AudioHelper.audioCtx.currentTime + duration);
    } catch (e) {
      console.log('Audio playback error:', e);
    }
  }

  static toggleMute() {
    AudioHelper.isMuted = !AudioHelper.isMuted;
    if (AudioHelper.isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return AudioHelper.isMuted;
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
}