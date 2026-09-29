const emotions = [
  { name: 'Happy', icon: '😀' },
  { name: 'Sad', icon: '😢' },
  { name: 'Surprised', icon: '😲' },
  { name: 'Silly', icon: '🤪' }
];

let targetEmotion;
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;

function startRound() {
  AudioHelper.initAudio();
  if (totalAttempts >= maxAttempts) {
    document.getElementById('results-summary').textContent = `Session finished! You matched ${correctAnswers} emotions!`;
    document.getElementById('results-modal').style.display = 'flex';
    AudioHelper.speak(`Session finished! You got ${correctAnswers} correct!`);
    return;
  }
  
  const container = document.getElementById('emotions-grid');
  container.innerHTML = '';
  
  const shuffled = [...emotions].sort(() => Math.random() - 0.5).slice(0, 3);
  targetEmotion = shuffled[Math.floor(Math.random() * shuffled.length)];
  
  document.getElementById('prompt').textContent = `Who feels ${targetEmotion.name}?`;
  AudioHelper.speak(`Who feels ${targetEmotion.name}?`);
  
  shuffled.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('emotion-card');
    card.textContent = item.icon;
    card.onclick = () => checkChoice(item, card);
    container.appendChild(card);
  });
  
  gsap.from('.emotion-card', { scale: 0, duration: 0.4, stagger: 0.1, ease: 'back.out' });
}

function checkChoice(selected, card) {
  totalAttempts++;
  document.getElementById('score-attempts').textContent = totalAttempts;
  
  if (selected.name === targetEmotion.name) {
    correctAnswers++;
    document.getElementById('score-correct').textContent = correctAnswers;
    AudioHelper.speak(`Yes! That is ${selected.name}!`);
    gsap.to(card, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1, onComplete: startRound });
  } else {
    AudioHelper.speak(`Try again!`);
    gsap.to(card, { x: 10, repeat: 3, yoyo: true, duration: 0.05, onComplete: startRound });
  }
}

function toggleMenu() {
  const modal = document.getElementById('menu-modal');
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function toggleMute() {
  const isMuted = AudioHelper.toggleMute();
  document.getElementById('mute-btn').textContent = isMuted ? '🔇 Muted' : '🔊 Audio';
}

document.addEventListener('DOMContentLoaded', startRound);