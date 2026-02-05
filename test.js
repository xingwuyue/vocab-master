// 测试脚本 - 诊断按钮点击问题
(function() {
    console.log('=== VocabMaster 诊断脚本 ===');
    
    // 检查 1: vocabularyData 是否加载
    console.log('1. vocabularyData 存在:', typeof vocabularyData !== 'undefined');
    if (typeof vocabularyData !== 'undefined') {
        console.log('   阶段1词汇数:', vocabularyData[1] ? vocabularyData[1].length : 0);
        console.log('   阶段2词汇数:', vocabularyData[2] ? vocabularyData[2].length : 0);
        console.log('   阶段3词汇数:', vocabularyData[3] ? vocabularyData[3].length : 0);
        console.log('   阶段4词汇数:', vocabularyData[4] ? vocabularyData[4].length : 0);
        console.log('   阶段5词汇数:', vocabularyData[5] ? vocabularyData[5].length : 0);
    }
    
    // 检查 2: 关键函数是否存在
    console.log('2. 关键函数检查:');
    console.log('   startStage:', typeof startStage === 'function');
    console.log('   getStageVocabulary:', typeof getStageVocabulary === 'function');
    console.log('   showScreen:', typeof showScreen === 'function');
    console.log('   shuffleArray:', typeof shuffleArray === 'function');
    console.log('   loadWord:', typeof loadWord === 'function');
    
    // 检查 3: 按钮事件绑定
    console.log('3. 按钮检查:');
    const stageBtns = document.querySelectorAll('.stage-btn');
    console.log('   找到阶段按钮数:', stageBtns.length);
    stageBtns.forEach((btn, idx) => {
        console.log(`   按钮 ${idx + 1}:`, btn.textContent, '| onclick:', btn.onclick !== null);
    });
    
    // 检查 4: 屏幕元素是否存在
    console.log('4. 屏幕元素检查:');
    console.log('   welcome-screen:', document.getElementById('welcome-screen') !== null);
    console.log('   learn-screen:', document.getElementById('learn-screen') !== null);
    console.log('   review-screen:', document.getElementById('review-screen') !== null);
    
    // 检查 5: 测试 startStage 函数
    console.log('5. 测试 startStage(1):');
    try {
        // 保存原始状态
        const originalStage = appState.currentStage;
        
        // 测试调用
        const testWords = getStageVocabulary(1);
        console.log('   getStageVocabulary(1) 返回:', testWords.length, '个词');
        
        if (testWords.length === 0) {
            console.error('   错误: 词汇数据为空！');
        } else {
            console.log('   第一个词:', testWords[0].word, '-', testWords[0].meaning);
        }
    } catch (e) {
        console.error('   错误:', e.message);
    }
    
    console.log('=== 诊断完成 ===');
})();
