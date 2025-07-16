
const countdownDisplay = document.getElementById('countdown');
const startButton = document.getElementById('startButton');
const pauseResumeButton = document.getElementById('pauseResumeButton');
const inputTime = document.getElementById('inputTime');

let timeLeft = 10;
let intervalId = null;
let isPaused = false;

function updateDisplay() {
  countdownDisplay.textContent = timeLeft >= 0 ? timeLeft : "Time's up!";
}

function startCountdown() {
  if (intervalId) clearInterval(intervalId);
  timeLeft = parseInt(inputTime.value, 10);
  if (isNaN(timeLeft) || timeLeft < 1) {
    alert('Please enter a valid number greater than 0');
    return;
  }
  isPaused = false;
  pauseResumeButton.textContent = 'Pause';
  pauseResumeButton.disabled = false;
  updateDisplay();

  intervalId = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      updateDisplay();
      if (timeLeft < 0) {
        clearInterval(intervalId);
        pauseResumeButton.disabled = true;
      }
    }
  }, 1000);
}

startButton.addEventListener('click', startCountdown);

pauseResumeButton.addEventListener('click', () => {
  if (timeLeft < 0) return;
  isPaused = !isPaused;
  pauseResumeButton.textContent = isPaused ? 'Resume' : 'Pause';
});

updateDisplay();
