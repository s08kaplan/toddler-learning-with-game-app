let currentAnswer = 0;
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;

function setupMathProblem() {
  AudioHelper.initAudio();
  if (totalAttempts >= maxAttempts) {
    document.getElementById('results-summary').textContent = `Math session complete! You counted correctly ${correctAnswers} times out of 5!`;
    document.getElementById('results-modal').style.display = 'flex';
    AudioHelper.speak(`Great math session! You got ${correctAnswers} correct!`);
    return;
  }
  
  const visualArea = document.getElementById('visual-area');
  const optionsArea = document.getElementById('options');
  visualArea.innerHTML = '';
  optionsArea.innerHTML = '';
  
  currentAnswer = Math.floor(Math.random() * 8) + 1;
  
  for (let i = 0; i < currentAnswer; i++) {
    const item = document.createElement('span');
    item.classList.add('apple');
    item.textContent = '🍎';
    visualArea.appendChild(item);
  }
  
  gsap.from('.apple', { scale: 0, y: -40, duration: 0.4, stagger: 0.08, ease: 'bounce.out' });
  AudioHelper.speak(`How many apples are there?`);
  
  let choices = [currentAnswer, currentAnswer + 1, Math.max(1, currentAnswer - 1)];
  choices.sort(() => Math.random() - 0.5);
  
  choices.forEach(num => {
    const btn = document.createElement('button');
    btn.classList.add('num-btn');
    btn.textContent = num;
    btn.onclick = () => checkAnswer(num, btn);
    optionsArea.appendChild(btn);
  });
}

function checkAnswer(selected, element) {
  totalAttempts++;
  document.getElementById('score-attempts').textContent = totalAttempts;
  
  if (selected === currentAnswer) {
    correctAnswers++;
    document.getElementById('score-correct').textContent = correctAnswers;
    AudioHelper.speak(`Yes! There are ${currentAnswer} apples!`);
    gsap.to(element, { scale: 1.2, backgroundColor: '#81c784', duration: 0.3, onComplete: setupMathProblem });
  } else {
    AudioHelper.speak(`Let's try counting again!`);
    gsap.to(element, { x: -10, repeat: 3, yoyo: true, duration: 0.08, onComplete: setupMathProblem });
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

document.addEventListener('DOMContentLoaded', setupMathProblem);