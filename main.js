const generateBtn = document.getElementById('generate-btn');
const lottoNumbersContainer = document.getElementById('lotto-numbers');
const themeToggle = document.getElementById('theme-toggle');

// Theme logic
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = 'Light Mode';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeToggle.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
});

// Lotto logic
generateBtn.addEventListener('click', () => {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    for (const number of sortedNumbers) {
        const circle = document.createElement('div');
        circle.classList.add('lotto-number');
        circle.textContent = number;
        const color = getRandomColor();
        circle.style.backgroundColor = color;
        lottoNumbersContainer.appendChild(circle);
    }
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Reactions logic
const reactionButtons = document.querySelectorAll('.reaction-btn');
let reactionsData = JSON.parse(localStorage.getItem('reactions')) || {
    upvote: 0, funny: 0, love: 1, surprised: 0, angry: 0, sad: 0
};
let userVoted = localStorage.getItem('userVoted');

function updateReactionsUI() {
    reactionButtons.forEach(btn => {
        const type = btn.dataset.type;
        btn.querySelector('.count').textContent = reactionsData[type];
        if (userVoted === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

reactionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        
        if (userVoted === type) {
            // Unvote
            reactionsData[type]--;
            userVoted = null;
        } else {
            // Change vote or first vote
            if (userVoted) {
                reactionsData[userVoted]--;
            }
            reactionsData[type]++;
            userVoted = type;
        }
        
        localStorage.setItem('reactions', JSON.stringify(reactionsData));
        localStorage.setItem('userVoted', userVoted || '');
        updateReactionsUI();
    });
});

updateReactionsUI();
