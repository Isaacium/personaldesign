const otBooksData = [
    { en: "Genesis", zh: "创世记", pinyin: "Chuàngshìjì" },
    { en: "Exodus", zh: "出埃及记", pinyin: "Chū'āijíjì" },
    { en: "Leviticus", zh: "利未记", pinyin: "Lìwèijì" },
    { en: "Numbers", zh: "民数记", pinyin: "Mínshùjì" },
    { en: "Deuteronomy", zh: "申命记", pinyin: "Shēnmìngjì" },
    { en: "Joshua", zh: "约书亚记", pinyin: "Yuēshūyàjì" },
    { en: "Judges", zh: "士师记", pinyin: "Shìshījì" },
    { en: "Ruth", zh: "路得记", pinyin: "Lùdéjì" },
    { en: "1 Samuel", zh: "撒母耳记上", pinyin: "Sāmǔ'ěrjì shàng" },
    { en: "2 Samuel", zh: "撒母耳记下", pinyin: "Sāmǔ'ěrjì xià" },
    { en: "1 Kings", zh: "列王纪上", pinyin: "Lièwángjì shàng" },
    { en: "2 Kings", zh: "列王纪下", pinyin: "Lièwángjì xià" },
    { en: "1 Chronicles", zh: "历代志上", pinyin: "Lìdàizhì shàng" },
    { en: "2 Chronicles", zh: "历代志下", pinyin: "Lìdàizhì xià" },
    { en: "Ezra", zh: "以斯拉记", pinyin: "Yǐsīlājì" },
    { en: "Nehemiah", zh: "尼希米记", pinyin: "Níxīmǐjì" },
    { en: "Esther", zh: "以斯帖记", pinyin: "Yǐsītiējì" },
    { en: "Job", zh: "约伯记", pinyin: "Yuēbójì" },
    { en: "Psalms", zh: "诗篇", pinyin: "Shīpiān" },
    { en: "Proverbs", zh: "箴言", pinyin: "Zhēnyán" },
    { en: "Ecclesiastes", zh: "传道书", pinyin: "Chuándàoshū" },
    { en: "Song of Solomon", zh: "雅歌", pinyin: "Yǎgē" },
    { en: "Isaiah", zh: "以赛亚书", pinyin: "Yǐsàiyàshū" },
    { en: "Jeremiah", zh: "耶利米书", pinyin: "Yēlìmǐshū" },
    { en: "Lamentations", zh: "耶利米哀歌", pinyin: "Yēlìmǐ'āigē" },
    { en: "Ezekiel", zh: "以西结书", pinyin: "Yǐxījiéshū" },
    { en: "Daniel", zh: "但以理书", pinyin: "Dànyǐlǐshū" },
    { en: "Hosea", zh: "何西阿书", pinyin: "Héxī'āshū" },
    { en: "Joel", zh: "约珥书", pinyin: "Yuē'ěrshū" },
    { en: "Amos", zh: "阿摩司书", pinyin: "Āmósīshū" },
    { en: "Obadiah", zh: "俄巴底亚书", pinyin: "Ébādǐyàshū" },
    { en: "Jonah", zh: "约拿书", pinyin: "Yuēnáshū" },
    { en: "Micah", zh: "弥迦书", pinyin: "Míjiāshū" },
    { en: "Nahum", zh: "那鸿书", pinyin: "Nàhóngshū" },
    { en: "Habakkuk", zh: "哈巴谷书", pinyin: "Hābāgǔshū" },
    { en: "Zephaniah", zh: "西番雅书", pinyin: "Xīfānyǎshū" },
    { en: "Haggai", zh: "哈该书", pinyin: "Hāgāishū" },
    { en: "Zechariah", zh: "撒迦利亚书", pinyin: "Sājiālìyàshū" },
    { en: "Malachi", zh: "玛拉基书", pinyin: "Mǎlājīshū" }
];

const ntBooksData = [
    { en: "Matthew", zh: "马太福音", pinyin: "Mǎtài fúyīn" },
    { en: "Mark", zh: "马可福音", pinyin: "Mǎkě fúyīn" },
    { en: "Luke", zh: "路加福音", pinyin: "Lùjiā fúyīn" },
    { en: "John", zh: "约翰福音", pinyin: "Yuēhàn fúyīn" },
    { en: "Acts", zh: "使徒行传", pinyin: "Shǐtú xíngzhuàn" },
    { en: "Romans", zh: "罗马书", pinyin: "Luómǎshū" },
    { en: "1 Corinthians", zh: "哥林多前书", pinyin: "Gēlínduō qiánshū" },
    { en: "2 Corinthians", zh: "哥林多后书", pinyin: "Gēlínduō hòushū" },
    { en: "Galatians", zh: "加拉太书", pinyin: "Jiālātàishū" },
    { en: "Ephesians", zh: "以弗所书", pinyin: "Yǐfúsuǒshū" },
    { en: "Philippians", zh: "腓立比书", pinyin: "Féilìbǐshū" },
    { en: "Colossians", zh: "歌罗西书", pinyin: "Gēluóxīshū" },
    { en: "1 Thessalonians", zh: "帖撒罗尼迦前书", pinyin: "Tiěsāluóníjiā qiánshū" },
    { en: "2 Thessalonians", zh: "帖撒罗尼迦后书", pinyin: "Tiěsāluóníjiā hòushū" },
    { en: "1 Timothy", zh: "提摩太前书", pinyin: "Tímótài qiánshū" },
    { en: "2 Timothy", zh: "提摩太后书", pinyin: "Tímótài hòushū" },
    { en: "Titus", zh: "提多书", pinyin: "Tíduōshū" },
    { en: "Philemon", zh: "腓利门书", pinyin: "Féilìménshū" },
    { en: "Hebrews", zh: "希伯来书", pinyin: "Xībóláishū" },
    { en: "James", zh: "雅各书", pinyin: "Yǎgèshū" },
    { en: "1 Peter", zh: "彼得前书", pinyin: "Bǐdé qiánshū" },
    { en: "2 Peter", zh: "彼得后书", pinyin: "Bǐdé hòushū" },
    { en: "1 John", zh: "约翰一书", pinyin: "Yuēhàn yīshū" },
    { en: "2 John", zh: "约翰二书", pinyin: "Yuēhàn èrshū" },
    { en: "3 John", zh: "约翰三书", pinyin: "Yuēhàn sānshū" },
    { en: "Jude", zh: "犹大书", pinyin: "Yóudàshū" },
    { en: "Revelation", zh: "启示录", pinyin: "Qǐshìlù" }
];

let targetSequence = [];
let currentIndex = 0;
let timerInterval = null;
let startTime = 0;
let gameActive = false;
let currentMode = '';
let currentLanguage = 'en'; // 'en' or 'zh'
let showPinyin = false;
let isTargetRevealed = false;

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const targetDisplay = document.getElementById('target-display');
    const timerDisplay = document.getElementById('timer');
    const bestDisplay = document.getElementById('best-display');
    const victoryMessage = document.getElementById('victory-message');
    const finalTimeDisplay = document.getElementById('final-time');
    const comparisonDisplay = document.getElementById('comparison-message');
    const searchBar = document.getElementById('search-bar');
    const muteIcon = document.getElementById('mute-icon');
    const volumeSlider = document.getElementById('volume-slider');

    if (!board || !targetDisplay || !timerDisplay) return;

    let previousVolume = 1;

    if (muteIcon && volumeSlider) {
        // Toggle mute icon and slider value when clicking the icon
        muteIcon.addEventListener('click', () => {
            if (parseFloat(volumeSlider.value) > 0) {
                // Mute
                previousVolume = volumeSlider.value;
                volumeSlider.value = 0;
                muteIcon.innerText = "🔇";
            } else {
                // Unmute
                volumeSlider.value = previousVolume > 0 ? previousVolume : 1;
                muteIcon.innerText = "🔊";
            }
        });

        // Update the icon based on slider input manually dragged
        volumeSlider.addEventListener('input', () => {
            if (parseFloat(volumeSlider.value) === 0) {
                muteIcon.innerText = "🔇";
            } else {
                muteIcon.innerText = "🔊";
                previousVolume = volumeSlider.value;
            }
        });
    }

    // Allow revealing the target with a penalty
    targetDisplay.addEventListener('click', () => {
        if (!gameActive || isTargetRevealed) return;

        isTargetRevealed = true;
        const targetBook = targetSequence[currentIndex];
        targetDisplay.innerHTML = getBookDisplayHTML(targetBook);
        targetDisplay.classList.remove('hidden-target');
        targetDisplay.classList.add('revealed-target');

        // Apply penalty (2.5 seconds)
        startTime -= 2500;
        updateTimer();
    });

    searchBar.addEventListener('input', () => {
        const term = searchBar.value.toLowerCase();
        const buttons = board.querySelectorAll('.book-btn:not(.found)');

        buttons.forEach(btn => {
            const enName = (btn.dataset.en || '').toLowerCase();
            const zhName = (btn.dataset.zh || '').toLowerCase();
            const pinyin = (btn.dataset.pinyin || '').toLowerCase();

            // Allow matching the start of the English name, ignoring numbers
            const enWithoutNumber = enName.replace(/^\d+\s+/, '');

            // Normalize pinyin to remove accents/diacritics and spaces
            const pinyinNormalized = pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
            const termNormalized = term.replace(/\s+/g, '');

            if (currentLanguage === 'zh') {
                if (zhName.includes(term) || pinyin.includes(term) || pinyinNormalized.includes(termNormalized)) {
                    btn.style.display = 'flex';
                } else {
                    btn.style.display = 'none';
                }
            } else {
                if (enName.startsWith(term) || enWithoutNumber.startsWith(term)) {
                    btn.style.display = 'flex';
                } else {
                    btn.style.display = 'none';
                }
            }
        });
    });

    // Handle language and pinyin toggles
    const langRadios = document.querySelectorAll('input[name="language-toggle"]');
    const pinyinCheckbox = document.getElementById('pinyin-toggle');
    const pinyinContainer = document.getElementById('pinyin-container');
    const modeBtnFull = document.getElementById('mode-btn-full');
    const modeBtnOt = document.getElementById('mode-btn-ot');
    const modeBtnNt = document.getElementById('mode-btn-nt');

    if (langRadios.length > 0) {
        langRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                currentLanguage = e.target.value;
                if (currentLanguage === 'zh') {
                    if (pinyinContainer) pinyinContainer.style.display = 'inline-flex';
                    if (modeBtnFull) modeBtnFull.innerText = "整本圣经 (66)";
                    if (modeBtnOt) modeBtnOt.innerText = "旧约 (39)";
                    if (modeBtnNt) modeBtnNt.innerText = "新约 (27)";
                } else {
                    if (pinyinContainer) pinyinContainer.style.display = 'none';
                    if (modeBtnFull) modeBtnFull.innerText = "Full Bible (66)";
                    if (modeBtnOt) modeBtnOt.innerText = "Old Testament (39)";
                    if (modeBtnNt) modeBtnNt.innerText = "New Testament (27)";
                }
                updateAllDisplays();
            });
        });
    }

    if (pinyinCheckbox) {
        pinyinCheckbox.addEventListener('change', (e) => {
            showPinyin = e.target.checked;
            updateAllDisplays();
        });
    }

    function updateAllDisplays() {
        if (!gameActive) return;

        // Update target display if revealed
        if (isTargetRevealed && currentIndex < targetSequence.length) {
            targetDisplay.innerHTML = getBookDisplayHTML(targetSequence[currentIndex]);
        }

        // Update all book buttons
        const buttons = board.querySelectorAll('.book-btn');
        buttons.forEach((btn, index) => {
            // We need to re-render the button innerHTML. We can look up the corresponding book object
            // by using the dataset attached to it.
            const bookEn = btn.dataset.en;
            // The clicked or rendered sequence is in board order, let's find the matching book object
            const bookObj = targetSequence.find(b => b.en === bookEn);
            if (bookObj) {
                btn.innerHTML = getBookDisplayHTML(bookObj);
            }
        });
    }

    function getBookDisplayHTML(bookObj) {
        if (currentLanguage === 'zh') {
            if (showPinyin) {
                return `<span>${bookObj.zh}</span><span class="pinyin">${bookObj.pinyin}</span>`;
            } else {
                return `<span>${bookObj.zh}</span>`;
            }
        }
        return `<span>${bookObj.en}</span>`;
    }

    // Make functions globally available if needed by onclick attributes
    window.startGame = function (mode) {
        // Stop existing game/timer
        clearInterval(timerInterval);
        victoryMessage.style.display = 'none';
        currentIndex = 0;
        timerDisplay.innerText = "0.0s";
        gameActive = true;
        currentMode = mode;

        // Update Best Time Display for this mode (using combined key so English/Chinese don't mix if they shouldn't, though they are same book layout, let's keep it separate)
        const storageKey = 'bible_speedrun_best_' + currentLanguage + '_' + mode;
        const savedBest = localStorage.getItem(storageKey);
        bestDisplay.innerText = savedBest ? parseFloat(savedBest).toFixed(1) + "s" : "--";

        // Determine sequence based on mode
        if (mode === 'ot') targetSequence = [...otBooksData];
        else if (mode === 'nt') targetSequence = [...ntBooksData];
        else targetSequence = [...otBooksData, ...ntBooksData];

        // Update display to show the first book to find
        updateTargetDisplay();

        // Create a shuffled array for the visual board
        let shuffledBooks = [...targetSequence];
        shuffleArray(shuffledBooks);

        // Render board
        board.innerHTML = '';
        shuffledBooks.forEach(bookObj => {
            const btn = document.createElement('button');
            btn.className = 'book-btn';
            btn.innerHTML = getBookDisplayHTML(bookObj);
            btn.dataset.en = bookObj.en;
            btn.dataset.zh = bookObj.zh;
            btn.dataset.pinyin = bookObj.pinyin;
            btn.onclick = () => handleBookClick(bookObj, btn);
            board.appendChild(btn);
        });

        // Show, clear, and focus search bar
        searchBar.style.display = 'inline-block';
        searchBar.value = '';
        searchBar.focus();

        // Start Timer
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 100);
    };

    function handleBookClick(clickedBookObj, btnElement) {
        if (!gameActive) return;
        if (btnElement.disabled) return;

        // Read the clicked book out loud
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            
            // Text to speak is based on current language
            const textToSpeak = currentLanguage === 'zh' ? clickedBookObj.zh : clickedBookObj.en;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            
            if (currentLanguage === 'zh') {
                utterance.lang = 'zh-CN';
            } else {
                utterance.lang = 'en-US';
            }

            const volumeSlider = document.getElementById('volume-slider');
            if (volumeSlider) {
                utterance.volume = parseFloat(volumeSlider.value);
            }
            window.speechSynthesis.speak(utterance);
        }

        const targetBookObj = targetSequence[currentIndex];

        if (clickedBookObj.en === targetBookObj.en) {
            // Correct!
            btnElement.classList.add('found');
            btnElement.classList.remove('wrong');
            btnElement.disabled = true;
            currentIndex++;

            // Instantly clear the search and focus back for the next book
            searchBar.value = '';
            searchBar.dispatchEvent(new Event('input')); // Trigger the filter update
            searchBar.focus();

            if (currentIndex >= targetSequence.length) {
                winGame();
            } else {
                updateTargetDisplay();
            }
        } else {
            // Wrong!
            btnElement.classList.remove('wrong');
            void btnElement.offsetWidth; // Trigger reflow
            btnElement.classList.add('wrong');

            // Penalty (5 seconds)
            startTime -= 5000;
            updateTimer();
        }
    }

    function updateTargetDisplay() {
        if (currentIndex < targetSequence.length) {
            isTargetRevealed = false;
            targetDisplay.innerText = "Reveal Book (+2.5s)";
            targetDisplay.classList.add('hidden-target');
            targetDisplay.classList.remove('revealed-target');
        }
    }

    function updateTimer() {
        const elapsedTime = (Date.now() - startTime) / 1000;
        timerDisplay.innerText = elapsedTime.toFixed(1) + "s";
    }

    function winGame() {
        clearInterval(timerInterval);
        gameActive = false;

        const rawTime = (Date.now() - startTime) / 1000;
        const finalTimeStr = rawTime.toFixed(1) + "s";

        targetDisplay.innerText = "Done!";
        targetDisplay.classList.remove('hidden-target');
        targetDisplay.classList.add('revealed-target');
        finalTimeDisplay.innerText = finalTimeStr;

        // Reveal all in correct order
        board.innerHTML = '';
        targetSequence.forEach(bookObj => {
            const div = document.createElement('div');
            div.className = 'book-btn correct';
            div.innerHTML = getBookDisplayHTML(bookObj);
            board.appendChild(div);
        });

        // Handle High Score Logic (per mode and language)
        const storageKey = 'bible_speedrun_best_' + currentLanguage + '_' + currentMode;
        const previousBest = localStorage.getItem(storageKey);
        let compMsg = "";

        if (!previousBest) {
            localStorage.setItem(storageKey, rawTime);
            compMsg = "First run completed! (New Record)";
        } else {
            const prevBestVal = parseFloat(previousBest);
            const diff = rawTime - prevBestVal;

            if (diff < 0) {
                // New Record
                const improvedBy = Math.abs(diff).toFixed(1);
                localStorage.setItem(storageKey, rawTime);
                compMsg = `🔥 New Record! Beat previous best by ${improvedBy}s!`;
            } else if (diff === 0) {
                compMsg = "Tied your best time!";
            } else {
                // Slower
                const missedBy = diff.toFixed(1);
                compMsg = `Missed best time (${prevBestVal.toFixed(1)}s) by ${missedBy}s.`;
            }
        }

        comparisonDisplay.innerText = compMsg;
        victoryMessage.style.display = 'block';

        // Hide search bar when game ends
        searchBar.style.display = 'none';

        // Update the header display immediately
        bestDisplay.innerText = localStorage.getItem(storageKey)
            ? parseFloat(localStorage.getItem(storageKey)).toFixed(1) + "s"
            : finalTimeStr;

        // Call the additional high score logic requested for the personal best display
        updateHighScore(rawTime);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Fisher-Yates Shuffle Algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});

// Save score to local browser storage
function updateHighScore(currentSessionTime) {
    const record = localStorage.getItem('bibleSpeedRunPB');
    if (!record || currentSessionTime < parseFloat(record)) {
        localStorage.setItem('bibleSpeedRunPB', currentSessionTime);
        displayHighScore();
        return true; // New Record
    }
    return false;
}

// Display score on page load
function displayHighScore() {
    const record = localStorage.getItem('bibleSpeedRunPB');
    const display = document.getElementById('best-time');
    if (record && display) {
        display.innerText = record + "s";
    }
}

// Call on init
document.addEventListener('DOMContentLoaded', displayHighScore);
