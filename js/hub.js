document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('start-overlay');
  const startBtn = document.getElementById('start-btn');
  
  const startApp = () => {
    AudioHelper.initAudio();
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        overlay.style.display = 'none';
        AudioHelper.speak("Welcome! Pick a game to start playing!");
      }
    });
    
    gsap.from('.game-card', {
      duration: 0.5,
      scale: 0,
      opacity: 0,
      stagger: 0.08,
      ease: 'back.out(1.5)'
    });
  };
  
  startBtn.addEventListener('click', startApp);
});