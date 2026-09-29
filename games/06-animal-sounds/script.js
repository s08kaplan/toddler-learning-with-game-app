const animals = [
  { name: 'Dog', icon: '🐶', soundText: 'Woof woof!' },
  { name: 'Cat', icon: '🐱', soundText: 'Meow meow!' },
  { name: 'Cow', icon: '🐮', soundText: 'Moo moo!' },
  { name: 'Duck', icon: '🦆', soundText: 'Quack quack!' }
];

let targetAnimal;
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;

function startRound() {
  AudioHelper.initAudio();
  if (totalAttempts >= maxAttempts) {
    document.getElementById('results-summary').textContent = `Game ended! You knew ${correctAnswers} animal sounds!`;
    document.getElementById('results-modal').style.display = 'flex';
    AudioHelper.speak(`Session complete! You got ${correctAnswers} correct!`);
    return;
  }
  
  const grid = document.getElementById('animals-grid');
  grid.innerHTML = '';
  
  const shuffled = [...animals].sort(() => Math.random() - 0.5).slice(0, 3);
  targetAnimal = shuffled[Math.floor(Math.random() * shuffled.length)];
  
  shuffled.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('animal-card');
    card.textContent = item.icon;
    card.onclick = () => checkChoice(item, card);
    grid.appendChild(card);
  });
  
  gsap.from('.animal-card', { scale: 0, duration: 0.4, stagger: 0.1, ease: 'back.out' });
  playCurrentSound();
}

function playCurrentSound() {
  AudioHelper.speak(targetAnimal.soundText);
}

function checkChoice(selected, card) {
  totalAttempts++;
  document.getElementById('score-attempts').textContent = totalAttempts;
  
  if (selected.name === targetAnimal.name) {
    correctAnswers++;
    document.getElementById('score-correct').textContent = correctAnswers;
    AudioHelper.speak(`Yes! ${selected.name} says ${selected.soundText}`);
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