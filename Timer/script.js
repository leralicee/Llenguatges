let timerInterval;
let timeLeft = 10 * 60;
let isRunning = false;
const defaultTime = 10 * 60;

// Elements DOM
const timerDisplay = document.getElementById('timer');
const minutesInput = document.getElementById('minutesInput');
const setButton = document.getElementById('setButton');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const statusText = document.querySelector('.text-white\\/80');

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
    
    if (timeLeft === 0) {
        statusText.textContent = 'ACABAT';
        timerDisplay.classList.add('text-red-300');
    } else {
        timerDisplay.classList.remove('text-red-300');
        statusText.textContent = 'EN MARXA';
    }
}

function startTimer() {
    if (isRunning || timeLeft === 0) return;
    
    isRunning = true;
    startButton.disabled = true;
    startButton.classList.add('opacity-50', 'cursor-not-allowed');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            isRunning = false;
            startButton.disabled = false;
            startButton.classList.remove('opacity-50', 'cursor-not-allowed');
            alert('Temps acabat!');
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    
    clearInterval(timerInterval);
    isRunning = false;
    startButton.disabled = false;
    startButton.classList.remove('opacity-50', 'cursor-not-allowed');
    statusText.textContent = 'PAUSAT';
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;

    const inputMinutes = parseInt(minutesInput.value);
    timeLeft = (inputMinutes && inputMinutes > 0) ? inputMinutes * 60 : defaultTime;

    startButton.disabled = false;
    startButton.classList.remove('opacity-50', 'cursor-not-allowed');

    updateDisplay();
    statusText.textContent = 'PREPARAT';
    timerDisplay.classList.remove('text-red-300');
}

function setTimerTime() {
    const inputMinutes = parseInt(minutesInput.value);
    
    if (inputMinutes && inputMinutes >= 1 && inputMinutes <= 60) {
        if (isRunning) {
            pauseTimer();
        }
        timeLeft = inputMinutes * 60;
        updateDisplay();
        statusText.textContent = 'TEMPS ESTABLERT';
    } else {
        alert('Introdueix un número entre 1 i 60');
        minutesInput.value = 10;
        timeLeft = defaultTime;
        updateDisplay();
    }
}

updateDisplay();

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
setButton.addEventListener('click', setTimerTime);

minutesInput.addEventListener('input', function() {
    let value = parseInt(this.value);
    if (value < 1) this.value = 1;
    if (value > 60) this.value = 60;
});

minutesInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        setTimerTime();
    }
});