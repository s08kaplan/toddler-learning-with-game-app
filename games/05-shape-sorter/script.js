const shapes = [
  { name: 'Circle', icon: '🔴' },
  { name: 'Square', icon: '🟧' },
  { name: 'Triangle', icon: '🔺' },
  { name: 'Star', icon: '⭐' }
];

let targetShape;
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;

function startRound() {
  AudioHelper.initAudio();
  if (totalAttempts >= maxAttempts) {
    document.getElementById('results-summary').textContent = `Session finished! You identified ${correctAnswers} shapes!`;
    document.getElementById('results-modal').style.display = 'flex';
    AudioHelper.speak(`Great job! You found ${correctAnswers} shapes!`);
    return;
  }
  
  const container = document.getElementById('shapes-grid');
  container.innerHTML = '';
  
  const shuffled = [...shapes].sort(() => Math.random() - 0.5).slice(0, 3);
  targetShape = shuffled[Math.floor(Math.random() * shuffled.length)];
  
  document.getElementById('prompt').textContent = `Tap the ${targetShape.name}!`;
  AudioHelper.speak(`Tap the ${targetShape.name}!`);
  
  shuffled.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('shape-card');
    card.innerHTML = `<span class="shape-icon">${item.icon}</span>`;
    card.onclick = () => checkChoice(item, card);
    container.appendChild(card);
  });
  
  gsap.from('.shape-card', { scale: 0, duration: 0.4, stagger: 0.1, ease: 'back.out' });
}

function checkChoice(selected, element) {
  totalAttempts++;
  document.getElementById('score-attempts').textContent = totalAttempts;
  
  if (selected.name === targetShape.name) {
    correctAnswers++;
    document.getElementById('score-correct').textContent = correctAnswers;
    AudioHelper.speak(`Awesome! That's the ${selected.name}!`);
    gsap.to(element, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1, onComplete: startRound });
  } else {
    AudioHelper.speak(`Not that one, try again!`);
    gsap.to(element, { x: 10, repeat: 3, yoyo: true, duration: 0.05, onComplete: startRound });
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