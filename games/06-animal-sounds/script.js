const animals = [
  { name: 'Cat', soundText: 'Meow! Meow!', emoji: '🐱' },
  { name: 'Dog', soundText: 'Woof! Woof!', emoji: '🐶' },
  { name: 'Duck', soundText: 'Quack! Quack!', emoji: '🦆' },
  { name: 'Cow', soundText: 'Moo! Moo!', emoji: '🐮' },
  { name: 'Lion', soundText: 'Roar! Roar!', emoji: '🦁' },
  { name: 'Frog', soundText: 'Ribbit! Ribbit!', emoji: '🐸' },
  { name: 'Pig', soundText: 'Oink! Oink!', emoji: '🐷' },
  { name: 'Sheep', soundText: 'Baa! Baa!', emoji: '🐑' },
  { name: 'Rooster', soundText: 'Cock-a-doodle-doo!', emoji: '🐓' },
  { name: 'Owl', soundText: 'Hoot! Hoot!', emoji: '🦉' },
  { name: 'Bee', soundText: 'Buzz! Buzz!', emoji: '🐝' },
  { name: 'Snake', soundText: 'Hiss! Hiss!', emoji: '🐍' },
  { name: 'Monkey', soundText: 'Ooh ooh ah ah!', emoji: '🐒' },
  { name: 'Elephant', soundText: 'Trumpet!', emoji: '🐘' },
  { name: 'Horse', soundText: 'Neigh! Neigh!', emoji: '🐴' },
  { name: 'Mouse', soundText: 'Squeak! Squeak!', emoji: '🐭' },
  { name: 'Bear', soundText: 'Grrr!', emoji: '🐻' },
  { name: 'Wolf', soundText: 'Awoo!', emoji: '🐺' },
  { name: 'Chick', soundText: 'Cheep! Cheep!', emoji: '🐥' },
  { name: 'Goat', soundText: 'Bleat! Bleat!', emoji: '🐐' }
];

let targetAnimal;
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;
let isGameStarted = false;

// Call this from the "Tap to Play" button to unblock Browser Speech Synthesis
function initAndStartGame() {
  AudioHelper.initAudio();
  document.getElementById('start-overlay').style.display = 'none';
  isGameStarted = true;
  startRound();
}

function startRound() {
  if (!isGameStarted) return;

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
    
    // FIX: Changed item.icon -> item.emoji so emojis render properly
    card.textContent = item.emoji;
    
    card.onclick = () => checkChoice(item, card);
    grid.appendChild(card);
  });
  
  gsap.from('.animal-card', { scale: 0, duration: 0.4, stagger: 0.1, ease: 'back.out' });
  
  // Play animal sound when round starts
  playCurrentSound();
}

function playCurrentSound() {
  if (targetAnimal && targetAnimal.soundText) {
    AudioHelper.speak(targetAnimal.soundText);
  }
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