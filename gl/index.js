// --- 配置部分 ---
    const IMAGE_URL = './doc/unforgetable.jpg'; 
    const TRIGGER_SEQUENCE = 'wxmwxm';
    const SHOW_DURATION_MS = 3000; 
    const INPUT_TIMEOUT_MS = 10000; 

    // --- DOM 元素 ---
    const triggerTarget = document.getElementById('trigger-target');
    const eggImageContainer = document.getElementById('egg-image-container');
    const eggImage = document.getElementById('egg-image');

    // --- 状态变量 ---
    let isListeningForKeypress = false;
    let inputBuffer = '';
    let timeoutId = null;

    eggImage.src = IMAGE_URL;

    // --- 隐藏功能逻辑 ---
    triggerTarget.addEventListener('click', function(e) {
        if (isListeningForKeypress) return; 
        
        isListeningForKeypress = true;
        inputBuffer = '';
        console.log('Secret mode activated. Start typing...');

        clearTimeout(timeoutId);
        timeoutId = setTimeout(resetState, INPUT_TIMEOUT_MS);
    });

    document.addEventListener('keydown', function(e) {
        if (!isListeningForKeypress) return;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(resetState, INPUT_TIMEOUT_MS);

        const key = e.key.toLowerCase();
        
        if (!TRIGGER_SEQUENCE.includes(key)) return;

        inputBuffer += key;
        console.log('Input buffer:', inputBuffer);

        if (inputBuffer === TRIGGER_SEQUENCE) {
            triggerEgg();
            resetState(); 
        } else if (!TRIGGER_SEQUENCE.startsWith(inputBuffer)) {
            console.log('Sequence broken.');
            resetState();
        }
    });

    // --- 核心功能实现 ---
    function triggerEgg() {
        console.log('Egg triggered!');
        eggImageContainer.classList.add('show');
        eggImage.classList.add('show');

        setTimeout(function() {
            eggImageContainer.classList.remove('show');
            eggImage.classList.remove('show');
        }, SHOW_DURATION_MS);
    }

    function resetState() {
        if (isListeningForKeypress) {
            console.log('Secret mode deactivated.');
        }
        isListeningForKeypress = false;
        inputBuffer = '';
        clearTimeout(timeoutId);
    }