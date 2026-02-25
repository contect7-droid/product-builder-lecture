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

// Teachable Machine Logic
const URL = "https://teachablemachine.withgoogle.com/models/KjSuZJZiH/";
let model, labelContainer, maxPredictions;

async function initModel() {
    const loadingDiv = document.getElementById('loading-model');
    loadingDiv.style.display = 'block';
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ''; // Clear previous labels if any
    for (let i = 0; i < maxPredictions; i++) {
        const barContainer = document.createElement("div");
        barContainer.className = "result-bar-container";
        barContainer.innerHTML = `
            <div class="result-bar">
                <div class="result-fill" style="width: 0%"></div>
                <div class="result-text"></div>
            </div>
        `;
        labelContainer.appendChild(barContainer);
    }
    loadingDiv.style.display = 'none';
}

async function predict() {
    const image = document.getElementById("face-image");
    const prediction = await model.predict(image);
    
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const bar = labelContainer.childNodes[i].querySelector('.result-fill');
        const text = labelContainer.childNodes[i].querySelector('.result-text');
        
        bar.style.width = probability + "%";
        // Assign color based on label name (Dog vs Cat)
        bar.classList.remove('dog-fill', 'cat-fill');
        bar.classList.add(classPrediction.toLowerCase() === 'dog' ? 'dog-fill' : 'cat-fill');
        text.innerHTML = `${classPrediction}: ${probability}%`;
    }
}

const imageUpload = document.getElementById('image-upload');
const faceImage = document.getElementById('face-image');
const previewContainer = document.getElementById('image-preview-container');

if (imageUpload) {
    imageUpload.addEventListener('change', async (e) => {
        if (!model) await initModel();
        
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                faceImage.src = event.target.result;
                previewContainer.style.display = 'block';
                faceImage.onload = async () => {
                    await predict();
                };
            };
            reader.readAsDataURL(file);
        }
    });
}
