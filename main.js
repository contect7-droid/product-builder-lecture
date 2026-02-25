// Routing System
function navigateTo(pageId) {
    // Update Active Page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');

    // Update Nav Links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === '#' + pageId) {
            link.classList.add('active-link');
        }
    });

    // Handle Comments Visibility (Only for lotto and animal pages)
    const commentsWrapper = document.getElementById('comments-wrapper');
    if (pageId === 'lotto' || pageId === 'animal') {
        commentsWrapper.classList.remove('hidden');
    } else {
        commentsWrapper.classList.add('hidden');
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Initial Navigation based on Hash
window.addEventListener('load', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Lotto Logic
const generateBtn = document.getElementById('generate-btn');
const lottoNumbersContainer = document.getElementById('lotto-numbers');

if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        lottoNumbersContainer.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        sortedNumbers.forEach((number, index) => {
            setTimeout(() => {
                const ball = document.createElement('div');
                ball.classList.add('lotto-ball');
                ball.textContent = number;
                lottoNumbersContainer.appendChild(ball);
            }, index * 100);
        });
    });
}

// Animal Test Logic
const URL = "https://teachablemachine.withgoogle.com/models/KjSuZJZiH/";
let model, labelContainer, maxPredictions;

async function initModel() {
    const loadingDiv = document.getElementById('loading-model');
    loadingDiv.style.display = 'block';
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
    maxPredictions = model.getTotalClasses();
    
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = '';
    for (let i = 0; i < maxPredictions; i++) {
        const barContainer = document.createElement("div");
        barContainer.className = "result-bar-container";
        labelContainer.appendChild(barContainer);
    }
    loadingDiv.style.display = 'none';
}

async function predict() {
    const image = document.getElementById("face-image");
    const prediction = await model.predict(image);
    
    let maxProb = 0;
    let bestResult = "";

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const prob = prediction[i].probability;
        const percentage = (prob * 100).toFixed(0);
        
        if (prob > maxProb) {
            maxProb = prob;
            bestResult = className;
        }

        const barContainer = labelContainer.childNodes[i];
        const colorClass = className.toLowerCase() === 'dog' ? 'dog-fill' : 'cat-fill';
        barContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.9rem; font-weight:600;">
                <span>${className}</span>
                <span>${percentage}%</span>
            </div>
            <div class="result-bar">
                <div class="result-fill ${colorClass}" style="width: ${percentage}%"></div>
            </div>
        `;
    }

    // Display Conclusion Text
    const conclusionText = document.getElementById('conclusion-text');
    conclusionText.textContent = `당신은 매력적인 ${bestResult === 'Dog' ? '강아지상' : '고양이상'}!`;
    document.getElementById('result-display').classList.remove('result-hidden');
}

const imageUpload = document.getElementById('image-upload');
if (imageUpload) {
    imageUpload.addEventListener('change', async (e) => {
        if (!model) await initModel();
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const faceImage = document.getElementById('face-image');
                faceImage.src = event.target.result;
                faceImage.onload = async () => {
                    await predict();
                };
            };
            reader.readAsDataURL(file);
        }
    });
}
