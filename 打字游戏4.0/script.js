// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyB5YPxjZXYBZzej8Jz9IxbQp3ni6yHx6kQ",
  authDomain: "typing-game-384814.firebaseapp.com",
  databaseURL: "https://typing-game-384814-default-rtdb.firebaseio.com",
  projectId: "typing-game-384814",
  storageBucket: "typing-game-384814.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890"
};

// 初始化 Firebase
let firebaseInitialized = false;
try {
    if (!window.firebase) {
        throw new Error('Firebase SDK not loaded');
    }
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    
    // 测试数据库连接
    const testRef = firebase.database().ref('.info/connected');
    testRef.on('value', (snap) => {
        console.log('Connection status:', snap.val());
        if (snap.val() === true) {
            console.log('Connected to Firebase');
            firebaseInitialized = true;
            updateLeaderboard(); // 连接成功后更新排行榜
        } else {
            console.log('Not connected to Firebase');
        }
    });
} catch (error) {
    console.error('Firebase initialization error:', error);
    const leaderboardList = document.getElementById('leaderboard-list');
    if (leaderboardList) {
        leaderboardList.innerHTML = `<div style="text-align: center; padding: 10px; color: #ff4444;">
            排行榜加载失败：${error.message}<br>
            请检查网络连接后刷新页面
        </div>`;
    }
}

const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const startButton = document.getElementById('start-btn');
const resetButton = document.getElementById('reset-btn');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const completedDisplay = document.getElementById('completed');
const languageSelect = document.getElementById('language-select');
const difficultySelect = document.getElementById('difficulty-select');
const timeSelect = document.getElementById('time-select');
const historyList = document.getElementById('history-list');
const loginContainer = document.getElementById('login-container');
const gameContainer = document.getElementById('game-container');
const usernameInput = document.getElementById('username-input');
const loginButton = document.getElementById('login-btn');
const loginStatus = document.getElementById('login-status');
const leaderboardList = document.getElementById('leaderboard-list');
const modeSelect = document.getElementById('mode-select');

const chineseTexts = {
    easy: [
        "苹果",
        "香蕉",
        "橙子",
        "背水一战",
        "完璧归赵",
        "青梅竹马",
        "白驹过隙",
        "瓜田李下",
        "投桃报李",
        "人面桃花",
        "李代桃僵",
        "笔走龙蛇",
        "牛刀割鸡",
        "虎头蛇尾",
        "羊质虎皮",
        "兔起鹘落",
        "鹤立鸡群",
        "鹦鹉学舌",
        "蜻蜓点水",
        "狼狈为奸",
        "蛛丝马迹",
        "蚕食鲸吞",
        "龙腾虎跃",
        "龙争虎斗",
        "凤毛麟角",
        "鸦雀无声",
        "鸿鹄之志",
        "鹏程万里",
        "燕颔虎颈",
        "鹬蚌相争",
        "轩然大波",
        "风卷残云",
        "电闪雷鸣",
        "雪中送炭",
        "锦上添花",
        "雾里看花",
        "水中捞月",
        "石破天惊",
        "海枯石烂",
        "沧海桑田",
        "刀山火海",
        "枪林弹雨",
        "珠光宝气",
        "珠联璧合",
        "玉碎珠沉",
        "金戈铁马",
        "金石为开",
        "金碧辉煌",
        "铜墙铁壁",
        "铁面无私",
        "铁石心肠",
        "炉火纯青",
        "火树银花",
        "火眼金睛",
        "木已成舟",
        "枯木逢春",
        "移花接木",
        "柳暗花明",
        "百步穿杨",
        "入木三分",
        "曲高和寡",
        "高山仰止",
        "大相径庭",
        "小肚鸡肠",
        "天罗地网",
        "天南地北",
        "天衣无缝",
        "天荒地老",
        "天诛地灭",
        "天长地久",
        "地动山摇",
        "地广人稀",
        "山穷水尽",
        "山清水秀",
        "山高水长",
        "山崩地裂",
        "海阔天空",
        "海纳百川",
        "海誓山盟",
        "河清海晏",
        "河东狮吼",
        "河落海干",
        "湖光山色",
        "江郎才尽",
        "江洋大盗",
        "源远流长",
        "根深蒂固",
        "盘根错节",
        "节外生枝",
        "枝繁叶茂",
        "粗枝大叶",
        "生活就像一盒巧克力。",
        "时间就是金钱。",
        "知识就是力量。",
        "学习使人进步。",
        "天道酬勤。",
        "一寸光阴一寸金。",
        "书山有路勤为径。",
        "业精于勤荒于嬉。",
        "学海无涯苦作舟。",
        "勤能补拾。"
    ],
    medium: [
        "编程是一门艺术，需要不断练习和提高。",
        "生活就像一盒巧克力，你永远不知道下一颗是什么味道。",
        "学习是一个持续的过程，需要保持耐心和专注。",
        "成功的关键在于持之以恒的努力和正确的方法，只有脚踏实地才能实现自己的目标。",
        "时间就像海绵里的水，挤一挤总是有的。",
        "人生就像一场马拉松，重要的是坚持到最后。",
        "读书破万卷，下笔如有神。",
        "工欲善其事，必先利其器。",
        "千里之行，始于足下。",
        "温故而知新，可以为师矣。"
    ],
    hard: [
        "哲学家们只是用不同的方式解释世界，而问题在于改变世界。",
        "想象力比知识更重要，因为知识是有限的，而想象力概括着世界上的一切。",
        "生存还是毁灭，这是一个值得考虑的问题，它关乎生命的抉择与意义。",
        "你若要喜爱你自己的价值，你就得给世界创造价值，体现自我与奉献的关联。",
        "生如夏花之绚烂，死如秋叶之静美，描绘出生命的理想状态与境界。",
        "知识就是力量，它能赋予人类改变命运、推动社会进步的能力。",
        "孔子曰：‘学而不思则罔，思而不学则殆。’",
        "孟子曰：‘天将降大任于是人也，必先苦其心志，劳其筋骨，饿其体肤，空乏其身，行拂乱其所为，所以动心忍性，曾益其所不能。’",
        "老子曰：‘知人者智，自知者明。胜人者有力，自胜者强。’",
        "庄子曰：‘吾生也有涯，而知也无涯。以有涯随无涯，殆已。已而为知者，殆而已矣。’",
        "荀子曰：‘学不可以已。’",
        "韩非子曰：‘学之经，莫若其人。’",
        "墨子曰：‘兼爱，尚贤，非攻。’",
        "董仲舒曰：‘天人之际，义之大者。’",
        "王阳明曰：‘知行合一。’",
        "曾国藩曰：‘吾日三省吾身。’",
        "毛泽东曰：‘实事求是。’",
        "邓小平曰：‘科学技术是第一生产力。’",
        "习近平曰：‘中国梦是中华民族伟大复兴的梦想。’",
        "编程开发是一项充满挑战和创造力的工作，需要我们不断学习和适应新技术。",
        "人工智能正在改变我们的生活方式，它带来了无限可能，同时也带来了新的挑战。",
        "成功的关键在于持之以恒的努力和正确的方法，只有脚踏实地才能实现自己的目标。",
        "生活中充满了各种机遇和挑战，关键是要保持积极乐观的心态，勇于面对困难。",
        "在这个快速发展的时代，终身学习变得越来越重要，我们需要不断更新知识和技能。",
        "真正的成功不仅仅是实现目标，更重要的是在追求目标的过程中获得的成长和进步。",
        "创新思维是推动社会进步的重要动力，我们要善于发现问题并提出创新的解决方案。",
        "团队合作是现代工作中不可或缺的能力，良好的沟通和协作可以带来更大的成功。",
        "在信息爆炸的时代，如何有效地获取和处理信息成为了一项重要的生存技能。",
        "坚持自己的梦想，相信付出终会有回报，这是实现人生价值的重要途径。",
    ]
};

const englishTexts = {
    easy: [
        "The quick brown fox.",
        "Time is money.",
        "Knowledge is power.",
        "Practice makes perfect.",
        "Keep it simple.",
        "Actions speak louder.",
        "Better late than never.",
        "Easy come, easy go.",
        "First things first.",
        "Less is more."
    ],
    medium: [
        "The quick brown fox jumps over the lazy dog.",
        "Success is not final, failure is not fatal.",
        "Where there is a will, there is a way.",
        "Actions speak louder than words.",
        "Time and tide wait for no man.",
        "A journey of a thousand miles begins with a single step.",
        "Every cloud has a silver lining.",
        "Don't judge a book by its cover.",
        "Rome wasn't built in a day.",
        "Practice what you preach."
    ],
    hard: [
        "Programming is the art of telling another human what one wants the computer to do.",
        "The only way to learn a new programming language is by writing programs in it.",
        "Sometimes the questions are complicated and the answers are simple.",
        "The future depends on what you do today, so make the most of the present time.",
        "Success is not the key to happiness. Happiness is the key to success.",
        "Innovation distinguishes between a leader and a follower in the modern world.",
        "The best way to predict the future is to create it with determination and hard work.",
        "Learning is not attained by chance, it must be sought for with ardor and diligence.",
        "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
        "Education is not preparation for life; education is life itself in all its wonderful complexity."
    ]
};

const idioms = [
    "青梅竹马",
    "白驹过隙",
    "瓜田李下",
    "投桃报李",
    "人面桃花",
    "李代桃僵",
    "笔走龙蛇",
    "牛刀割鸡",
    "虎头蛇尾",
    "羊质虎皮",
    "兔起鹘落",
    "鹤立鸡群",
    "鹦鹉学舌",
    "蜻蜓点水",
    "狼狈为奸",
    "蛛丝马迹",
    "蚕食鲸吞",
    "龙腾虎跃",
    "龙争虎斗",
    "凤毛麟角",
    "鸦雀无声",
    "鸿鹄之志",
    "鹏程万里",
    "燕颔虎颈",
    "鹬蚌相争",
    "轩然大波",
    "风卷残云",
    "电闪雷鸣",
    "雪中送炭",
    "锦上添花",
    "雾里看花",
    "水中捞月",
    "石破天惊",
    "海枯石烂",
    "沧海桑田",
    "刀山火海",
    "枪林弹雨",
    "珠光宝气",
    "珠联璧合",
    "玉碎珠沉",
    "金戈铁马",
    "金石为开",
    "金碧辉煌",
    "铜墙铁壁",
    "铁面无私",
    "铁石心肠",
    "炉火纯青",
    "火树银花",
    "火眼金睛",
    "木已成舟",
    "枯木逢春",
    "移花接木",
    "柳暗花明",
    "百步穿杨",
    "入木三分",
    "曲高和寡",
    "高山仰止",
    "大相径庭",
    "小肚鸡肠",
    "天罗地网",
    "天南地北",
    "天衣无缝",
    "天荒地老",
    "天诛地灭",
    "天长地久",
    "地动山摇",
    "地广人稀",
    "山穷水尽",
    "山清水秀",
    "山高水长",
    "山崩地裂",
    "海阔天空",
    "海纳百川",
    "海誓山盟",
    "河清海晏",
    "河东狮吼",
    "河落海干",
    "湖光山色",
    "江郎才尽",
    "江洋大盗",
    "源远流长",
    "根深蒂固",
    "盘根错节",
    "节外生枝",
    "枝繁叶茂",
    "粗枝大叶",
    "叶瘦花残",
    "花团锦簇",
    "花红柳绿",
    "花言巧语",
    "鸟语花香",
    "草长莺飞",
    "风吹草动",
    "风调雨顺",
    "风雨同舟",
    "风雨如晦",
    "风平浪静",
    "风烛残年",
    "风驰电掣",
    "风和日丽",
    "风和日暖",
    "风清月朗",
    "风清弊绝",
    "云蒸霞蔚",
    "云开见日",
    "云谲波诡",
    "云淡风轻",
    "九霄云外",
    "万里无云",
    "云泥之别",
    "云起龙骧",
    "云消雾散",
    "雾鬓风鬟",
    "雾锁烟迷",
    "暮鼓晨钟",
    "晨钟暮鼓",
    "黄钟大吕",
    "五光十色",
    "斑驳陆离",
    "光怪陆离",
    "光彩照人",
    "光宗耀祖",
    "发扬光大",
    "浮光掠影",
    "回光返照",
    "刀光剑影",
    "春光明媚",
    "光阴似箭",
    "日月如梭",
    "日积月累",
    "日理万机",
    "日薄西山",
    "日升月恒",
    "日新月异",
    "日以继夜",
    "日无暇晷",
    "日上三竿",
    "日暮途穷",
    "日就月将",
    "星罗棋布",
    "星移斗转",
    "星火燎原",
    "星驰电掣",
    "披星戴月",
    "众星捧月",
    "流星赶月",
    "福星高照",
    "三星在户",
];

let currentText = '';
let timeLeft = 60;
let timer = null;
let startTime = null;
let totalTypedOverall = 0;
let correctTypedOverall = 0;
let currentTextIndex = -1;
let completedTexts = 0;
let gameHistory = [];
let currentTyped = 0;
let currentCorrect = 0;
let currentUser = null;
let currentMode = 'text';

// 背景设置相关元素
const bgColorPicker = document.getElementById('bg-color');
const customBgUrl = document.getElementById('custom-bg-url');
const applyBgButton = document.getElementById('apply-bg');
const backgroundPreviews = document.querySelectorAll('.background-preview');
const bgFileInput = document.getElementById('bg-file');
const chooseFileButton = document.getElementById('choose-file');

// 本地图片选择功能
chooseFileButton.addEventListener('click', () => {
    bgFileInput.click();
});

bgFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.body.style.backgroundImage = `url('${e.target.result}')`;
            document.body.style.backgroundColor = '';
            customBgUrl.value = '';
            bgColorPicker.value = '#f0f0f0';
            backgroundPreviews.forEach(preview => preview.classList.remove('active'));
        };
        reader.readAsDataURL(file);
    }
});

// 背景设置功能
function applyBackground() {
    const bgUrl = customBgUrl.value.trim();
    if (bgUrl) {
        document.body.style.backgroundImage = `url('${bgUrl}')`;
        document.body.style.backgroundColor = '';
        bgFileInput.value = ''; // 清除文件选择
    } else {
        document.body.style.backgroundImage = '';
        document.body.style.backgroundColor = bgColorPicker.value;
    }
    
    backgroundPreviews.forEach(preview => {
        preview.classList.remove('active');
        if (preview.dataset.color === bgColorPicker.value) {
            preview.classList.add('active');
        }
    });
}

function cleanText(text) {
    return text.replace(/[.,!?，。！？、：:;\s]/g, '');
}

function getTexts() {
    const language = languageSelect.value;
    const difficulty = difficultySelect.value;
    if (language === 'chinese' && difficulty === 'idioms') {
        return idioms;
    } else {
        return language === 'chinese' ? chineseTexts[difficulty] : englishTexts[difficulty];
    }
}

function getRandomText() {
    if (currentMode === 'keyboard') {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        let randomText = '';
        for (let i = 0; i < 10; i++) { // 生成10个随机字母
            const randomIndex = Math.floor(Math.random() * letters.length);
            randomText += letters[randomIndex];
        }
        return randomText;
    }
    const texts = getTexts();
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * texts.length);
    } while (newIndex === currentTextIndex && texts.length > 1);
    currentTextIndex = newIndex;
    return texts[newIndex];
}

function updateStats() {
    const timeElapsed = (parseInt(timeSelect.value) - timeLeft) / 60;
    const totalCorrectChars = correctTypedOverall + currentCorrect;
    const wpm = Math.round((totalCorrectChars / 5) / timeElapsed);
    wpmDisplay.textContent = `${wpm} WPM`;

    const totalChars = totalTypedOverall + currentTyped;
    const accuracy = totalChars > 0 ? Math.round(((correctTypedOverall + currentCorrect) / totalChars) * 100) : 100;
    accuracyDisplay.textContent = `${accuracy}%`;
    completedDisplay.textContent = completedTexts;

    return { wpm, accuracy };
}

function checkInput() {
    if (currentMode === 'keyboard') {
        const allowedCharacters = /^[a-zA-Z]+$/;
        if (!allowedCharacters.test(inputField.value)) {
            inputField.value = inputField.value.replace(/[^a-zA-Z]/g, '');
        }
    }
    const currentInput = inputField.value;
    let displayText = '';
    let allCorrect = true;
    
    // 将目标文本和输入文本都转换为纯文字数组（去除标点和空格）
    const targetChars = [...currentText].filter(char => /[\u4e00-\u9fa5a-zA-Z0-9]/.test(char));
    const inputChars = [...currentInput].filter(char => /[\u4e00-\u9fa5a-zA-Z0-9]/.test(char));
    
    // 在显示时保留原始文本的格式
    let inputIndex = 0;
    [...currentText].forEach((char) => {
        if (/[\u4e00-\u9fa5a-zA-Z0-9]/.test(char)) {
            // 如果是文字，需要检查输入
            if (inputIndex < inputChars.length) {
                if (char.toLowerCase() === inputChars[inputIndex].toLowerCase()) {
                    displayText += `<span class="correct">${char}</span>`;
                } else {
                    displayText += `<span class="incorrect">${char}</span>`;
                    allCorrect = false;
                }
                inputIndex++;
            } else {
                displayText += char;
            }
        } else {
            // 如果是标点或空格，直接显示，不参与检查
            displayText += `<span class="punctuation">${char}</span>`;
        }
    });
    
    textDisplay.innerHTML = displayText;
    
    // 更新统计数据时只考虑文字
    const cleanedTarget = [...currentText].filter(char => /[\u4e00-\u9fa5a-zA-Z0-9]/.test(char));
    currentTyped = inputChars.length;
    currentCorrect = inputChars.filter((char, i) => char.toLowerCase() === cleanedTarget[i].toLowerCase()).length;
    
    updateStats();

    // 检查是否完成当前文本（只比较文字部分）
    if (inputChars.length === cleanedTarget.length && allCorrect) {
        totalTypedOverall += currentTyped;
        correctTypedOverall += currentCorrect;
        currentTyped = 0;
        currentCorrect = 0;
        completedTexts++;
        setTimeout(nextText, 500);
    }
}

function nextText() {
    currentText = getRandomText();
    textDisplay.textContent = currentText;
    inputField.value = '';
    inputField.focus();
}

function updateHistory() {
    const history = JSON.parse(localStorage.getItem('typingHistory') || '[]');
    historyList.innerHTML = '';
    
    history.forEach((record, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const details = document.createElement('div');
        details.className = 'history-details';
        details.innerHTML = `
            <span class="history-wpm">${record.wpm} WPM</span>
            <span class="history-accuracy">准确率: ${record.accuracy}%</span>
            <span class="history-time">${new Date(record.timestamp).toLocaleString()}</span>
        `;
        
        const shareButton = document.createElement('button');
        shareButton.className = 'share-btn';
        shareButton.textContent = record.shared ? '已分享' : '分享到排行榜';
        shareButton.disabled = record.shared;
        
        if (!record.shared) {
            shareButton.addEventListener('click', () => {
                console.log('分享按钮被点击');
                if (currentUser) {
                    // 更新本地存储中的分享状态
                    history[index].shared = true;
                    localStorage.setItem('typingHistory', JSON.stringify(history));
                    
                    // 提交成绩到排行榜
                    submitScore(record.wpm, record.accuracy);
                    
                    // 更新按钮状态
                    shareButton.textContent = '已分享';
                    shareButton.disabled = true;
                    shareButton.classList.add('shared');
                } else {
                    alert('请先登录后再分享成绩！');
                }
            });
        }
        
        historyItem.appendChild(details);
        historyItem.appendChild(shareButton);
        historyList.appendChild(historyItem);
    });
}

function startGame() {
    timeLeft = parseInt(timeSelect.value);
    totalTypedOverall = 0;
    correctTypedOverall = 0;
    completedTexts = 0;
    currentTextIndex = -1;
    
    startButton.disabled = true;
    inputField.disabled = false;
    languageSelect.disabled = true;
    difficultySelect.disabled = true;
    timeSelect.disabled = true;
    modeSelect.disabled = true;
    
    inputField.value = '';
    inputField.focus();
    nextText();
    startTime = new Date();

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    inputField.disabled = true;
    startButton.disabled = false;
    languageSelect.disabled = false;
    difficultySelect.disabled = false;
    timeSelect.disabled = false;
    modeSelect.disabled = false;
    
    const stats = updateStats();
    
    // 保存成绩到历史记录
    const history = JSON.parse(localStorage.getItem('typingHistory') || '[]');
    history.unshift({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        timestamp: Date.now(),
        shared: false  // 新增字段，标记是否已分享
    });
    localStorage.setItem('typingHistory', JSON.stringify(history));
    
    updateHistory();
    
    const finalWpm = wpmDisplay.textContent;
    const finalAccuracy = accuracyDisplay.textContent;
    alert(`测试结束！\n完成段落数：${completedTexts}\n最终速度：${finalWpm}\n准确率：${finalAccuracy}`);
}

function resetGame() {
    if (timer) {
        clearInterval(timer);
    }
    timeLeft = parseInt(timeSelect.value);
    timerDisplay.textContent = timeLeft;
    totalTypedOverall = 0;
    correctTypedOverall = 0;
    completedTexts = 0;
    completedDisplay.textContent = '0';
    wpmDisplay.textContent = '0 WPM';
    accuracyDisplay.textContent = '100%';
    
    inputField.value = '';
    inputField.disabled = true;
    startButton.disabled = false;
    languageSelect.disabled = false;
    difficultySelect.disabled = false;
    timeSelect.disabled = false;
    modeSelect.disabled = false;
    
    textDisplay.textContent = '';
}

loginButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        currentUser = username;
        loginContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        updateLeaderboard();
    } else {
        loginStatus.textContent = '请输入用户名';
    }
});

const leaderboardKey = 'leaderboard'; // 定义排行榜的 localStorage 键

function readLeaderboard() {
    const data = localStorage.getItem(leaderboardKey);
    if (!data) return [];
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const leaderboard = lines.map(line => {
        const [username, score, time] = line.split(', ');
        return { username, score: parseInt(score), time };
    });
    return leaderboard;
}

function writeScoreToLeaderboard(username, score) {
    const time = new Date().toLocaleString();
    const entry = `${username}, ${score}, ${time}`;
    const currentLeaderboard = localStorage.getItem(leaderboardKey) || '';
    localStorage.setItem(leaderboardKey, currentLeaderboard + entry + '\n');
    console.log('成绩已保存到排行榜');
}

function updateLeaderboard() {
    const leaderboard = readLeaderboard();
    leaderboardList.innerHTML = leaderboard.map((entry, index) => `
        <div class="leaderboard-item">
            <span class="leaderboard-rank">${index + 1}</span>
            <span class="leaderboard-username">${entry.username}</span>
            <span class="leaderboard-score">${entry.score} 分</span>
            <span class="leaderboard-time">${entry.time}</span>
        </div>
    `).join('');
}

function submitScore(wpm, accuracy) {
    if (!currentUser) return;
    const score = calculateScore(wpm); // 使用新的评分计算函数
    writeScoreToLeaderboard(currentUser, score);
    updateLeaderboard(); // 更新排行榜显示
}

function calculateScore(wpm) {
    let score;
    if (wpm > 20) {
        score = 90 + (wpm - 20);
    } else if (wpm >= 15) {
        score = 60 + (wpm - 15) * 6;
    } else {
        score = 56 + (wpm - 14) * -4; // 14为基准
    }
    return score;
}

modeSelect.innerHTML += '<option value="keyboard">键盘模式</option>';
modeSelect.addEventListener('change', (event) => {
    currentMode = event.target.value;
});

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
inputField.addEventListener('input', checkInput);
languageSelect.addEventListener('change', () => textDisplay.textContent = '');
difficultySelect.addEventListener('change', () => textDisplay.textContent = '');

backgroundPreviews.forEach(preview => {
    preview.addEventListener('click', () => {
        const color = preview.dataset.color;
        bgColorPicker.value = color;
        customBgUrl.value = '';
        applyBackground();
    });
});

bgColorPicker.addEventListener('input', () => {
    customBgUrl.value = '';
    applyBackground();
});

applyBgButton.addEventListener('click', applyBackground);

const keyboard = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
];

function clearLeaderboard() {
    localStorage.removeItem(leaderboardKey);
    leaderboardList.innerHTML = '';
}

// 在这里添加一个按钮来调用 clearLeaderboard 函数
const clearLeaderboardButton = document.createElement('button');
clearLeaderboardButton.textContent = '清空排行榜';
clearLeaderboardButton.addEventListener('click', clearLeaderboard);
document.body.appendChild(clearLeaderboardButton);

let leaderboard = [];

function deleteRecord(index) {
    leaderboard.splice(index, 1); // 从排行榜中删除指定记录
    renderLeaderboard(); // 重新渲染排行榜
}

function renderLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = ''; // 清空当前显示
    leaderboard.forEach((record, index) => {
        const recordDiv = document.createElement('div');
        recordDiv.className = 'record';
        recordDiv.innerHTML = `<span>${record.user} - ${record.score}分</span>`;
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-record';
        deleteButton.textContent = '删除';
        deleteButton.onclick = () => deleteRecord(index); // 为每个按钮添加事件监听器
        recordDiv.appendChild(deleteButton);
        leaderboardList.appendChild(recordDiv);
    });
}

// 添加删除排行榜记录的功能
const deleteButton = document.getElementById('delete-records');
deleteButton.addEventListener('click', () => {
    // 清空排行榜记录
    localStorage.removeItem(leaderboardKey);
    leaderboardList.innerHTML = '';
    alert('排行榜记录已删除！');
});
