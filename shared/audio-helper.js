class AudioHelper {
  static isMuted = false;
  static audioCtx = null;
  
  static initAudio() {
    if (!AudioHelper.audioCtx) {
      AudioHelper.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (AudioHelper.audioCtx.state === 'suspended') {
      AudioHelper.audioCtx.resume();
    }
    // Resume SpeechSynthesis engine if paused by browser
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }
  
  static speak(text, rate = 0.85) {
    if (AudioHelper.isMuted) return;
    if ('speechSynthesis' in window) {
      AudioHelper.initAudio();
      window.speechSynthesis.cancel(); // Clear queued speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.2;
      
      // Brief timeout prevents browser speech engine lockups on fast clicks
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
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