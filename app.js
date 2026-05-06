// VocabMaster 主应用逻辑

// ============ 词汇数据配置 ============
const stageRanges = {
    1: { start: 1, end: 1000, count: 1000, name: '高频基础' },
    2: { start: 1001, end: 3000, count: 2000, name: '日常交流' },
    3: { start: 3001, end: 5000, count: 2000, name: '进阶提升' },
    4: { start: 5001, end: 10000, count: 5000, name: '中高级' },
    5: { start: 10001, end: 30000, count: 20000, name: '精通级' }
};

function cleanMeaning(raw) {
    if (!raw) return '暂无释义';

    let text = String(raw)
        .replace(/^["'“”]+|["'“”]+$/g, '')
        .replace(/\r|\n/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

    if (!text) return '暂无释义';

    // 优先抽取中文释义：取第一条更“字典级”的简洁释义
    // ECDICT 常见分隔：\n / ; / ；
    const cn = text
        .split(/[;；]/)
        .map(s => s.trim())
        .find(s => /[\u4e00-\u9fff]/.test(s));

    if (cn) {
        // 再截断到第一个句号/分号前，防止太长
        const first = cn.split(/[。！？]/)[0].trim();
        return first || '暂无释义';
    }

    // 没有中文：保留最前面的英文释义，去掉词性前缀（n./v./adj./adv.）
    const en = text.split(/[;。]/)[0].trim().replace(/^(n|v|adj|adv|prep|conj|pron|det)\.?\s*/i, '');
    return en || '暂无释义';
}

function normalizeWordEntry(word, index) {
    return {
        ...word,
        _index: index,
        meaning: cleanMeaning(word.meaning),
        example: word.example || '—',
        exampleCN: word.exampleCN || '—'
    };
}

function getStageVocabulary(stage) {
    if (typeof vocabularyData !== 'undefined' && vocabularyData[stage]) {
        return vocabularyData[stage].map((word, index) => normalizeWordEntry(word, index));
    }
    console.error('词汇数据未加载或阶段不存在:', stage);
    return [];
}

// ============ 全局状态 ============
const appState = {
    currentStage: 1,
    currentMode: 'learn', // 'learn' | 'review'
    currentIndex: 0,
    wordsQueue: [],
    userProgress: {},
    reviewQueue: [],
    dailyGoal: 20,
    todayLearned: 0
};

// ============ 初始化 ============
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    console.log('vocabularyData exists:', typeof vocabularyData !== 'undefined');
    if (typeof vocabularyData !== 'undefined') {
        console.log('Stage 1 count:', vocabularyData[1]?.length);
    }
    initApp();
});

function initApp() {
    loadProgress();
    updateStatsOverview();
    updateStageProgress();
    setupKeyboardShortcuts();
}

// ============ 数据持久化 ============
const PROGRESS_VERSION = 2;

function loadProgress() {
    const saved = localStorage.getItem('vocabMaster_progress');
    if (saved) {
        appState.userProgress = JSON.parse(saved);
    }

    const savedVersion = parseInt(localStorage.getItem('vocabMaster_progressVersion') || '1');
    if (savedVersion < PROGRESS_VERSION) {
        // 旧版进度索引不兼容，清理掌握列表避免误判“已学完”
        for (let stage = 1; stage <= 5; stage++) {
            delete appState.userProgress[`stage_${stage}_mastered`];
        }
        localStorage.setItem('vocabMaster_progressVersion', PROGRESS_VERSION.toString());
        saveProgress();
        alert('⚠️ 检测到旧版进度数据，已重置“已掌握”列表以避免误判。');
    }
    
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('vocabMaster_lastDate');
    if (savedDate !== today) {
        appState.todayLearned = 0;
        localStorage.setItem('vocabMaster_lastDate', today);
    } else {
        appState.todayLearned = parseInt(localStorage.getItem('vocabMaster_todayLearned') || '0');
    }
}

function saveProgress() {
    localStorage.setItem('vocabMaster_progress', JSON.stringify(appState.userProgress));
    localStorage.setItem('vocabMaster_todayLearned', appState.todayLearned.toString());
    localStorage.setItem('vocabMaster_progressVersion', PROGRESS_VERSION.toString());
}

// ============ 阶段管理 ============
function startStage(stage) {
    appState.currentStage = stage;
    appState.currentMode = 'learn';
    appState.currentIndex = 0;
    
    // 加载该阶段的词汇
    const allWords = getStageVocabulary(stage);
    const targetCount = stageRanges[stage]?.count || allWords.length;
    const actualCount = allWords.length;

    if (actualCount === 0) {
        alert('⚠️ 该阶段词库尚未加载，请稍后再试或更新词库。');
        return;
    }

    if (actualCount < targetCount) {
        alert(`⚠️ 当前阶段词库数量仅有 ${actualCount}，未达到目标 ${targetCount}。
可先学习现有词库，后续再补充。`);
    }
    
    // 过滤掉已掌握的词汇（用原始索引）
    const masteredWords = getMasteredWords(stage);
    appState.wordsQueue = allWords.filter((word) => !masteredWords.includes(word._index));
    
    // 如果全部掌握，提示用户
    if (appState.wordsQueue.length === 0) {
        alert('🎉 恭喜！这个阶段的所有词汇你已经全部掌握了！');
        return;
    }
    
    // 随机打乱学习顺序
    appState.wordsQueue = shuffleArray(appState.wordsQueue).slice(0, appState.dailyGoal);
    
    showScreen('learn-screen');
    updateLearnUI();
    loadWord();
}

function getMasteredWords(stage) {
    const key = `stage_${stage}_mastered`;
    return appState.userProgress[key] || [];
}

function addMasteredWord(stage, wordIndex) {
    const key = `stage_${stage}_mastered`;
    if (!appState.userProgress[key]) {
        appState.userProgress[key] = [];
    }
    if (!appState.userProgress[key].includes(wordIndex)) {
        appState.userProgress[key].push(wordIndex);
    }
    saveProgress();
}

function addHardWord(stage, word) {
    const key = `stage_${stage}_hard`;
    if (!appState.userProgress[key]) {
        appState.userProgress[key] = [];
    }
    if (!appState.userProgress[key].find(w => w.word === word.word)) {
        appState.userProgress[key].push({
            ...word,
            reviewCount: 0,
            lastReviewed: new Date().toISOString()
        });
    }
    saveProgress();
}

// ============ 学习界面 ============
function updateLearnUI() {
    const stageNames = {
        1: '阶段 1',
        2: '阶段 2', 
        3: '阶段 3',
        4: '阶段 4',
        5: '阶段 5'
    };
    
    document.getElementById('current-stage').textContent = stageNames[appState.currentStage];
    document.getElementById('learn-counter').textContent = 
        `${appState.currentIndex + 1} / ${appState.wordsQueue.length}`;
}

function loadWord() {
    if (appState.currentIndex >= appState.wordsQueue.length) {
        finishLearning();
        return;
    }
    
    const word = appState.wordsQueue[appState.currentIndex];
    
    // 隐藏详情
    document.getElementById('word-details').classList.remove('show');
    document.getElementById('show-text').textContent = '显示释义';
    document.getElementById('show-icon').textContent = '👁️';
    
    // 更新单词内容
    document.getElementById('word-text').textContent = word.word || '—';
    document.getElementById('word-phonetic').textContent = word.phonetic || '';
    document.getElementById('word-meaning').textContent = word.meaning || '暂无释义';
    document.getElementById('word-example').textContent = word.example || '—';
    document.getElementById('word-example-cn').textContent = word.exampleCN || '—';
    
    // 更新级别标签
    const levels = {
        1: '高频基础',
        2: '日常交流',
        3: '进阶提升',
        4: '中高级',
        5: '精通级'
    };
    document.getElementById('word-level').textContent = levels[appState.currentStage];
    
    // 更新计数器
    document.getElementById('learn-counter').textContent = 
        `${appState.currentIndex + 1} / ${appState.wordsQueue.length}`;
    
    // 添加动画效果
    const card = document.getElementById('word-card');
    card.classList.add('changing');
    setTimeout(() => card.classList.remove('changing'), 300);
}

function toggleDetails() {
    const details = document.getElementById('word-details');
    const btnText = document.getElementById('show-text');
    const btnIcon = document.getElementById('show-icon');
    
    if (details.classList.contains('show')) {
        details.classList.remove('show');
        btnText.textContent = '显示释义';
        btnIcon.textContent = '👁️';
    } else {
        details.classList.add('show');
        btnText.textContent = '隐藏释义';
        btnIcon.textContent = '🙈';
        
        // 自动播放发音
        playAudio();
    }
}

function markWord(difficulty) {
    const word = appState.wordsQueue[appState.currentIndex];

    // 只要做出判断，就算“学习了一个”
    appState.todayLearned++;
    
    if (difficulty === 'easy') {
        // 标记为已掌握（记录原始索引）
        addMasteredWord(appState.currentStage, word._index);
    } else {
        // 标记为需复习
        addHardWord(appState.currentStage, word);
    }
    
    // 下一个单词
    appState.currentIndex++;
    saveProgress();
    loadWord();
}

function finishLearning() {
    updateStatsOverview();
    updateStageProgress();
    
    const message = `🎉 本轮学习完成！\n\n今日已学习: ${appState.todayLearned} 个单词\n继续加油！`;
    alert(message);
    
    goHome();
}

// ============ 发音功能 ============
function playAudio() {
    const word = document.getElementById('word-text').textContent;
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    } else {
        console.log('Speech synthesis not supported');
    }
}

// ============ 复习模式 ============
function startReview() {
    // 收集所有需要复习的单词
    appState.reviewQueue = [];
    
    for (let stage = 1; stage <= 5; stage++) {
        const hardKey = `stage_${stage}_hard`;
        const hardWords = appState.userProgress[hardKey] || [];
        
        // 优先复习最近标记为难的单词
        hardWords.forEach(item => {
            appState.reviewQueue.push({
                ...item,
                stage: stage
            });
        });
    }
    
    if (appState.reviewQueue.length === 0) {
        alert('🎉 太棒了！目前没有需要复习的单词。继续学习新单词吧！');
        return;
    }
    
    // 打乱顺序
    appState.reviewQueue = shuffleArray(appState.reviewQueue).slice(0, 20);
    appState.currentIndex = 0;
    
    showScreen('review-screen');
    loadReviewQuestion();
}

function loadReviewQuestion() {
    if (appState.currentIndex >= appState.reviewQueue.length) {
        alert('🎉 复习完成！继续保持！');
        goHome();
        return;
    }
    
    const item = appState.reviewQueue[appState.currentIndex];
    
    document.getElementById('quiz-word').textContent = item.word || '—';
    document.getElementById('quiz-phonetic').textContent = item.phonetic || '';
    document.getElementById('review-counter').textContent = 
        `${appState.currentIndex + 1} / ${appState.reviewQueue.length}`;
    
    // 生成选项（1个正确 + 3个干扰项）
    const options = generateQuizOptions(item);
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option === item.meaning, item, option);
        optionsContainer.appendChild(btn);
    });
}

function generateQuizOptions(correctItem) {
    const options = [correctItem.meaning];

    // 从同阶段随机选干扰项，如果不足则从所有阶段补充
    let otherMeanings = getStageVocabulary(correctItem.stage)
        .filter(w => w.meaning !== correctItem.meaning)
        .map(w => w.meaning);

    // 如果同阶段释义不足，从其他阶段补充
    if (otherMeanings.length < 3) {
        for (let stage = 1; stage <= 5; stage++) {
            if (stage === correctItem.stage) continue;
            const extra = getStageVocabulary(stage)
                .filter(w => w.meaning !== correctItem.meaning && !otherMeanings.includes(w.meaning))
                .map(w => w.meaning);
            otherMeanings = otherMeanings.concat(extra);
            if (otherMeanings.length >= 10) break;
        }
    }

    // 去重
    otherMeanings = [...new Set(otherMeanings)];

    while (options.length < 4 && otherMeanings.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherMeanings.length);
        const meaning = otherMeanings.splice(randomIndex, 1)[0];
        if (!options.includes(meaning)) {
            options.push(meaning);
        }
    }

    // 如果仍然不足 4 个选项，用占位符填充
    while (options.length < 4) {
        options.push('暂无释义');
    }

    return shuffleArray(options);
}

function checkAnswer(isCorrect, item, chosenText) {
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === item.meaning) {
            btn.classList.add('correct');
        }
        if (!isCorrect && chosenText && btn.textContent === chosenText && btn.textContent !== item.meaning) {
            btn.classList.add('wrong');
        }
    });
    
    if (isCorrect) {
        // 从难词列表中移除
        const hardKey = `stage_${item.stage}_hard`;
        const hardWords = appState.userProgress[hardKey] || [];
        appState.userProgress[hardKey] = hardWords.filter(w => w.word !== item.word);
        saveProgress();
    }
    
    setTimeout(() => {
        appState.currentIndex++;
        loadReviewQuestion();
    }, 1500);
}

// ============ 统计功能 ============
function showStats() {
    showScreen('stats-screen');
    renderStats();
}

function renderStats() {
    const container = document.getElementById('detailed-stats');
    container.innerHTML = '';
    
    let totalMastered = 0;
    let totalWords = 0;
    
    for (let stage = 1; stage <= 5; stage++) {
        const range = stageRanges[stage];
        const actualCount = getStageVocabulary(stage).length;
        const effectiveCount = actualCount || range.count;
        const mastered = getMasteredWords(stage).length;
        const hard = (appState.userProgress[`stage_${stage}_hard`] || []).length;
        
        totalMastered += mastered;
        totalWords += effectiveCount;
        
        const card = document.createElement('div');
        card.className = 'detail-stat-card';
        card.innerHTML = `
            <h3>${range.name}</h3>
            <p style="font-size: 2rem; font-weight: 800; margin: 12px 0; color: #8b7dff;">
                ${mastered} / ${effectiveCount}${actualCount < range.count ? ` (目标${range.count})` : ''}
            </p>
            <p style="color: #7b6fa3;">
                已掌握 ${effectiveCount ? ((mastered/effectiveCount)*100).toFixed(1) : 0}% · 
                需复习 ${hard} 词
            </p>
        `;
        container.appendChild(card);
    }
    
    // 绘制进度图
    drawProgressChart(totalMastered, totalWords);
}

function drawProgressChart(mastered, total) {
    const canvas = document.getElementById('progress-chart');
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // 清空
    ctx.clearRect(0, 0, width, height);
    
    // 绘制总进度圆环
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    // 背景圆环
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(123, 111, 163, 0.25)';
    ctx.lineWidth = 20;
    ctx.stroke();
    
    // 进度圆环（防止除零错误）
    const progress = total > 0 ? mastered / total : 0;
    if (progress > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.strokeStyle = '#8b7dff';
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
    
    // 中心文字
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 36px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`${(progress * 100).toFixed(1)}%`, centerX, centerY + 10);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Inter';
    ctx.fillText(`${mastered} / ${total} 词`, centerX, centerY + 35);
}

// ============ 界面更新 ============
function updateStatsOverview() {
    let totalMastered = 0;
    let totalWords = 0;
    
    for (let stage = 1; stage <= 5; stage++) {
        totalMastered += getMasteredWords(stage).length;
        const range = stageRanges[stage];
        const actualCount = getStageVocabulary(stage).length;
        totalWords += actualCount || range.count;
    }
    
    document.getElementById('total-learned').textContent = appState.todayLearned;
    document.getElementById('total-mastered').textContent = totalMastered;
    document.getElementById('total-progress').textContent = 
        `${totalWords ? ((totalMastered / totalWords) * 100).toFixed(1) : 0}%`;
}

function updateStageProgress() {
    for (let stage = 1; stage <= 5; stage++) {
        const range = stageRanges[stage];
        const actualCount = getStageVocabulary(stage).length;
        const effectiveCount = actualCount || range.count;
        const mastered = getMasteredWords(stage).length;
        const percentage = effectiveCount ? (mastered / effectiveCount) * 100 : 0;
        
        const fill = document.getElementById(`progress-${stage}`);
        if (fill) {
            // 先移除动画类，触发重绘
            fill.classList.remove('animating');
            void fill.offsetWidth; // 强制重绘
            fill.style.width = `${percentage}%`;
            // 添加动画类
            fill.classList.add('animating');
        }
        document.getElementById(`text-${stage}`).textContent = 
            `${mastered}/${effectiveCount}${actualCount < range.count ? ` (目标${range.count})` : ''}`;
        
        // 如果全部掌握，添加完成标记
        const card = document.querySelector(`[data-stage="${stage}"]`);
        if (mastered >= effectiveCount && effectiveCount > 0) {
            card.classList.add('completed');
        }
    }
}

// ============ 辅助功能 ============
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function goHome() {
    showScreen('welcome-screen');
    updateStatsOverview();
    updateStageProgress();
}

function resetProgress() {
    if (confirm('⚠️ 确定要重置所有学习进度吗？此操作不可撤销！')) {
        localStorage.removeItem('vocabMaster_progress');
        localStorage.removeItem('vocabMaster_todayLearned');
        localStorage.removeItem('vocabMaster_lastDate');
        localStorage.removeItem('vocabMaster_progressVersion');

        appState.userProgress = {};
        appState.todayLearned = 0;

        updateStatsOverview();
        updateStageProgress();

        // 移除所有阶段的完成标记
        for (let stage = 1; stage <= 5; stage++) {
            const card = document.querySelector(`[data-stage="${stage}"]`);
            if (card) card.classList.remove('completed');
        }

        alert('进度已重置，重新开始学习吧！');
    }
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============ 键盘快捷键 ============
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // 只在学习界面生效，排除复习界面
        const learnScreen = document.getElementById('learn-screen');
        const reviewScreen = document.getElementById('review-screen');
        if (!learnScreen.classList.contains('active') || reviewScreen.classList.contains('active')) {
            return;
        }

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                toggleDetails();
                break;
            case 'ArrowLeft':
                markWord('hard');
                break;
            case 'ArrowRight':
                markWord('easy');
                break;
        }
    });
}
