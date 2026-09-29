const items = ['🐶', '🐶', '🐱', '🐱', '🍎', '🍎'];
let flippedCards = [];
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;

function initGame() {
  AudioHelper.initAudio();
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  flippedCards = [];
  const shuffled = [...items].sort(() => Math.random() - 0.5);

  shuffled.forEach((emoji) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = emoji;

    const inner = document.createElement('span');
    inner.classList.add('content');
    inner.textContent = emoji;
    card.appendChild(inner);

    card.addEventListener('click', () => handleCardClick(card));
    grid.appendChild(card);
  });

  gsap.from('.card', { duration: 0.5, scale: 0, stagger: 0.1, ease: 'back.out(1.5)' });
  AudioHelper.speak("Find the matching pairs!");
}

function handleCardClick(card) {
  if (flippedCards.length === 2 || card.classList.contains('flipped') || totalAttempts >= maxAttempts) return;

  gsap.to(card, {
    rotationY: 180, duration: 0.3,
    onComplete: () => card.classList.add('flipped')
  });

  flippedCards.push(card);
  if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
  totalAttempts++;
  document.getElementById('score-attempts').textContent = totalAttempts;
  const [card1, card2] = flippedCards;

  if (card1.dataset.symbol === card2.dataset.symbol) {
    correctAnswers++;
    document.getElementById('score-correct').textContent = correctAnswers;
    flippedCards = [];
    AudioHelper.playTone(587, 'sine', 0.2);
    AudioHelper.speak("Great match!");
    gsap.to([card1, card2], { scale: 1.1, yoyo: true, repeat: 1, duration: 0.2 });

    checkSessionEnd();
  } else {
    setTimeout(() => {
      gsap.to([card1, card2], {
        rotationY: 0, duration: 0.3,
        onComplete: () => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          flippedCards = [];
          checkSessionEnd();
        }
      });
      AudioHelper.playTone(200, 'sawtooth', 0.2);
    }, 1000);
  }
}

function checkSessionEnd() {
  if (totalAttempts >= maxAttempts) {
    setTimeout(() => {
      document.getElementById('results-summary').textContent = `Session finished! You matched ${correctAnswers} times!`;
      document.getElementById('results-modal').style.display = 'flex';
      AudioHelper.speak(`Session complete! You got ${correctAnswers} correct!`);
    }, 500);
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

document.addEventListener('DOMContentLoaded', initGame);