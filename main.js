// Language Data
const i18n = {
    ko: {
        nav_lotto: "로또번호",
        nav_animal: "동물상",
        nav_guide: "이용가이드",
        nav_contact: "문의하기",
        hero_title: "당신의 오늘을 특별하게",
        hero_desc: "AI 분석부터 행운의 번호까지, 지금 바로 시작해보세요.",
        btn_get_lotto: "로또 번호 받기",
        btn_animal_test: "동물상 테스트",
        lotto_title: "행운의 로또 번호",
        lotto_desc: "시스템이 추천하는 오늘의 번호 6개를 확인하세요.",
        lotto_placeholder: "번호를 생성해주세요",
        btn_generate: "번호 생성하기",
        animal_title: "AI 동물상 테스트",
        animal_desc: "나와 가장 닮은 동물은 무엇일까요? 사진으로 확인하세요.",
        upload_label: "사진 업로드 또는 드래그",
        loading: "AI 분석 중...",
        guide_title: "이용 가이드",
        guide_desc: "Luck & AI 서비스를 더 효과적으로 이용하는 방법입니다.",
        guide_1_title: "로또 알고리즘",
        guide_1_desc: "저희 로또 번호 생성기는 순수 난수 발생 알고리즘을 사용하며, 어떠한 조작도 없는 공정한 확률을 제공합니다.",
        guide_2_title: "AI 모델 정보",
        guide_2_desc: "동물상 분석은 수십만 장의 데이터를 학습한 신경망 모델을 통해 얼굴형과 이목구비를 분석하여 결과를 도출합니다.",
        guide_3_title: "데이터 보안",
        guide_3_desc: "모든 사진 분석은 사용자의 기기 내에서 처리되며, 서버로 이미지가 전송되거나 저장되지 않습니다.",
        contact_title: "문의하기",
        contact_desc: "의견이나 제휴 문의는 언제든지 환영합니다.",
        label_email: "이메일",
        label_msg: "메시지",
        btn_send: "보내기",
        comm_title: "커뮤니티 의견",
        comm_desc: "자유롭게 소통하고 행운을 나눠보세요."
    },
    en: {
        nav_lotto: "Lotto",
        nav_animal: "AI Face",
        nav_guide: "Guide",
        nav_contact: "Contact",
        hero_title: "Make Your Day Special",
        hero_desc: "From AI analysis to lucky numbers, start right now.",
        btn_get_lotto: "Get Lotto Numbers",
        btn_animal_test: "Animal Face Test",
        lotto_title: "Lucky Lotto Numbers",
        lotto_desc: "Check today's 6 numbers recommended by the system.",
        lotto_placeholder: "Please generate numbers",
        btn_generate: "Generate Now",
        animal_title: "AI Animal Face Test",
        animal_desc: "Which animal do you resemble the most? Check with a photo.",
        upload_label: "Upload or Drag Photo",
        loading: "AI Analyzing...",
        guide_title: "User Guide",
        guide_desc: "How to use Luck & AI services more effectively.",
        guide_1_title: "Lotto Algorithm",
        guide_1_desc: "Our generator uses a pure random algorithm, providing fair odds without manipulation.",
        guide_2_title: "AI Model Info",
        guide_2_desc: "Face analysis uses a neural network model trained on hundreds of thousands of data points.",
        guide_3_title: "Data Security",
        guide_3_desc: "All photo analysis is processed on your device; images are never sent to or stored on our servers.",
        contact_title: "Contact Us",
        contact_desc: "Feedback and partnership inquiries are always welcome.",
        label_email: "Email",
        label_msg: "Message",
        btn_send: "Send",
        comm_title: "Community",
        comm_desc: "Communicate freely and share your luck."
    }
};

let currentLang = localStorage.getItem('lang') || 'ko';

function updateLanguage() {
    const langData = i18n[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = langData[key];
            } else {
                el.textContent = langData[key];
            }
        }
    });
    document.getElementById('lang-btn').textContent = currentLang === 'ko' ? 'EN' : 'KO';
}

// Routing System
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');

    const commentsWrapper = document.getElementById('comments-wrapper');
    if (pageId === 'lotto' || pageId === 'animal') {
        commentsWrapper.classList.remove('hidden');
    } else {
        commentsWrapper.classList.add('hidden');
    }
    window.scrollTo(0, 0);
}

// Initial Setup
window.addEventListener('load', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);
    updateLanguage();
});

// Lang Toggle
document.getElementById('lang-btn').addEventListener('click', () => {
    currentLang = currentLang === 'ko' ? 'en' : 'ko';
    localStorage.setItem('lang', currentLang);
    updateLanguage();
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
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
    try {
        model = await tmImage.load(URL + "model.json", URL + "metadata.json");
        maxPredictions = model.getTotalClasses();
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = '';
        for (let i = 0; i < maxPredictions; i++) {
            const barContainer = document.createElement("div");
            barContainer.className = "result-bar-container";
            labelContainer.appendChild(barContainer);
        }
    } catch (e) {
        console.error("Model Load Error:", e);
    }
    loadingDiv.style.display = 'none';
}

async function predict() {
    if (!model) return;
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

    const conclusionText = document.getElementById('conclusion-text');
    const resultMsg = currentLang === 'ko' ? `당신은 매력적인 ${bestResult === 'Dog' ? '강아지상' : '고양이상'}!` : `You are a charming ${bestResult}!`;
    conclusionText.textContent = resultMsg;
    document.getElementById('result-display').classList.remove('result-hidden');
    document.getElementById('result-display').style.display = 'block'; // Ensure visibility
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
