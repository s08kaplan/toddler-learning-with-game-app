const colors = [
  { name: 'Red', hex: '#FF4D4D' },
  { name: 'Blue', hex: '#4D94FF' },
  { name: 'Yellow', hex: '#FFD700' },
  { name: 'Green', hex: '#6BCB77' }
];

let targetColor;
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;

function startRound() {
  AudioHelper.initAudio();
  if (totalAttempts >= maxAttempts) {
    document.getElementById('results-summary').textContent = `Game complete! You identified ${correctAnswers} colors out of 5!`;
    document.getElementById('results-modal').style.display = 'flex';
    AudioHelper.speak(`Game over! You got ${correctAnswers} correct!`);
    return;
  }
  
  const container = document.getElementById('color-options');
  container.innerHTML = '';
  
  const shuffled = [...colors].sort(() => Math.random() - 0.5).slice(0, 3);
  targetColor = shuffled[Math.floor(Math.random() * shuffled.length)];
  
  document.getElementById('instruction').textContent = `Tap the ${targetColor.name} color!`;
  AudioHelper.speak(`Tap the ${targetColor.name} color!`);
  
  shuffled.forEach(color => {
    const circle = document.createElement('div');
    circle.classList.add('color-circle');
    circle.style.backgroundColor = color.hex;
    circle.addEventListener('click', () => handleChoice(color, circle));
    container.appendChild(circle);
  });
  
  gsap.from('.color-circle', { scale: 0, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'back.out' });
}

function handleChoice(selected, element) {
  totalAttempts++;
  document.getElementById('score-attempts').textContent = totalAttempts;
  
  if (selected.name === targetColor.name) {
    correctAnswers++;
    document.getElementById('score-correct').textContent = correctAnswers;
    AudioHelper.speak(`Correct! That is ${selected.name}!`);
    gsap.to(element, { scale: 1.3, duration: 0.3, yoyo: true, repeat: 1, onComplete: startRound });
  } else {
    AudioHelper.speak(`Oops! Try again.`);
    gsap.to(element, { x: 10, duration: 0.05, repeat: 5, yoyo: true, onComplete: startRound });
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