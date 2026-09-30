const colors = [
  { name: 'Red', hex: '#E53935' },
  { name: 'Blue', hex: '#1E88E5' },
  { name: 'Yellow', hex: '#FDD835' },
  { name: 'Green', hex: '#43A047' },
  { name: 'Orange', hex: '#FB8C00' },
  { name: 'Purple', hex: '#8E24AA' },
  { name: 'Pink', hex: '#F06292' },
  { name: 'Brown', hex: '#6D4C41' },
  { name: 'Cyan', hex: '#00ACC1' },
  { name: 'Lime', hex: '#C0CA33' },
  { name: 'Teal', hex: '#00897B' },
  { name: 'Indigo', hex: '#3949AB' },
  { name: 'Gold', hex: '#FFB300' },
  { name: 'Maroon', hex: '#880E4F' },
  { name: 'Coral', hex: '#FF7043' },
  { name: 'Mint Green', hex: '#A5D6A7' },
  { name: 'Lavender', hex: '#CE93D8' },
  { name: 'Peach', hex: '#FFCC80' },
  { name: 'Olive', hex: '#9E9D24' },
  { name: 'Sky Blue', hex: '#81D4FA' }
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