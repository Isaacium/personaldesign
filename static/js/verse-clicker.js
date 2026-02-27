document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".post-content");
    if (!container) return;

    // Build verses array from HTML
    const children = Array.from(container.children);
    let versions = [];
    let currentVersion = null;
    let uiNode = null;

    children.forEach(child => {
        if (child.id === "verse-clicker-ui") {
            uiNode = child;
            return;
        }
        if (child.tagName === "LINK" || child.tagName === "SCRIPT" || child.id === "high-score-display") {
            return;
        }

        if (child.tagName === "H2") {
            if (currentVersion && currentVersion.text) {
                versions.push(currentVersion);
            }
            currentVersion = {
                title: child.textContent.trim(),
                text: "",
                reference: ""
            };
            child.style.display = "none";
        } else if (currentVersion) {
            if (child.tagName === "P") {
                const text = child.textContent.trim();
                if (text.match(/\d+:\d+/) || (text.length < 40 && currentVersion.text)) {
                    currentVersion.reference += (currentVersion.reference ? " " : "") + text;
                } else {
                    currentVersion.text += (currentVersion.text ? " " : "") + text;
                }
            }
            child.style.display = "none";
        } else {
            child.style.display = "none";
        }
    });

    if (currentVersion && currentVersion.text) {
        versions.push(currentVersion);
    }

    if (versions.length === 0) return;

    if (uiNode) {
        uiNode.style.display = "block";
    }

    // Set up volume controls
    const muteIcon = document.getElementById("vc-mute-icon");
    const volumeSlider = document.getElementById("vc-volume-slider");

    if (muteIcon && volumeSlider) {
        muteIcon.addEventListener("click", () => {
            if (parseFloat(volumeSlider.value) > 0) {
                vcPreviousVolume = volumeSlider.value;
                volumeSlider.value = 0;
                muteIcon.innerText = "🔇";
            } else {
                volumeSlider.value = vcPreviousVolume > 0 ? vcPreviousVolume : 1;
                muteIcon.innerText = "🔊";
            }
        });

        volumeSlider.addEventListener("input", () => {
            if (parseFloat(volumeSlider.value) === 0) {
                muteIcon.innerText = "🔇";
            } else {
                muteIcon.innerText = "🔊";
                vcPreviousVolume = volumeSlider.value;
            }
        });
    }

    window.vcVersions = versions;
    initVerseGameUI();
});

let vcTimerInterval;
let vcStartTime;
let vcGameActive = false;
let vcCurrentTokens = [];
let vcTargetIndex = 0;
let vcShowPinyin = false;
let vcPreviousVolume = 1;
const VC_BANK_SIZE = 10; // total words shown in bank at once (1 correct + distractors)

function getSelectedVersion() {
    const radio = document.querySelector('input[name="vc-language-toggle"]:checked');
    if (!radio) return window.vcVersions[0];
    return window.vcVersions[parseInt(radio.value)];
}

function updateExistingWords() {
    const words = document.querySelectorAll('.vc-word');
    words.forEach(w => {
        if (vcShowPinyin && w.dataset.pinyin && getSelectedVersion().title.includes("Chinese") && !getSelectedVersion().title.includes("Pinyin")) {
            w.innerHTML = `<span>${w.dataset.word}</span><span style="font-size:0.75rem; color:#64748b; margin-top:4px; display:block;">${w.dataset.pinyin}</span>`;
            w.style.flexDirection = "column";
            w.style.display = w.style.display === "none" ? "none" : "inline-flex";
            w.style.alignItems = "center";
        } else {
            w.textContent = w.dataset.word;
            w.style.display = w.style.display === "none" ? "none" : "block";
        }
    });
}

function updatePinyinToggleVisibility() {
    const pContainer = document.getElementById("vc-pinyin-container");
    if (!pContainer) return;
    const v = getSelectedVersion();
    if (v.title.includes("Chinese") && !v.title.includes("Pinyin")) {
        pContainer.style.display = "inline-flex";
    } else {
        pContainer.style.display = "none";
    }
}

function initVerseGameUI() {
    const langContainer = document.getElementById("vc-language-settings");
    langContainer.innerHTML = "";
    
    window.vcVersions.forEach((v, index) => {
        const label = document.createElement("label");
        label.className = "toggle-label";
        label.style.cursor = "pointer";
        
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "vc-language-toggle";
        radio.value = index;
        if (index === 0) radio.checked = true;
        
        radio.addEventListener("change", () => {
            updatePinyinToggleVisibility();
            resetVerseGame();
        });

        label.appendChild(radio);
        label.appendChild(document.createTextNode(" " + v.title));
        langContainer.appendChild(label);
    });
    
    const pinyinContainer = document.createElement("label");
    pinyinContainer.className = "toggle-label";
    pinyinContainer.id = "vc-pinyin-container";
    pinyinContainer.style.cursor = "pointer";
    pinyinContainer.style.display = "none";

    const pinyinCheckbox = document.createElement("input");
    pinyinCheckbox.type = "checkbox";
    pinyinCheckbox.id = "vc-pinyin-toggle";
    pinyinCheckbox.addEventListener("change", (e) => {
        vcShowPinyin = e.target.checked;
        updateExistingWords();
    });

    pinyinContainer.appendChild(pinyinCheckbox);
    pinyinContainer.appendChild(document.createTextNode(" Show Pinyin"));
    langContainer.appendChild(pinyinContainer);

    updatePinyinToggleVisibility();
    updateBestTimeDisplay();
}

function tokenizeText(text) {
    return text.trim().split(/\s+/).filter(w => w.length > 0);
}

function updateBestTimeDisplay() {
    const v = getSelectedVersion();
    const gameId = window.location.pathname.replace(/\/$/, '') + "-" + v.title.replace(/\s+/g, '-');
    const bestTimes = JSON.parse(localStorage.getItem('vc-best-times') || '{}');
    const best = bestTimes[gameId];
    document.getElementById("vc-best-display").textContent = best ? best.toFixed(1) + "s" : "--";
}

function resetVerseGame() {
    clearInterval(vcTimerInterval);
    vcGameActive = false;
    document.getElementById("vc-timer").textContent = "0.0s";
    document.getElementById("vc-game-area").style.display = "none";
    document.getElementById("vc-victory-message").style.display = "none";
    document.getElementById("vc-start-btn").style.display = "inline-block";
    
    const volCont = document.getElementById("vc-volume-control");
    if (volCont) volCont.style.display = "none";
    
    // Check if new mode is selected
    updateBestTimeDisplay();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

window.showCurrentLeaderboardVC = function() {
    const v = getSelectedVersion();
    const gameId = window.location.pathname.replace(/\/$/, '') + "-" + v.title.replace(/\s+/g, '-');
    window.leaderboardSystem.showLeaderboard(gameId);
};

// Build and display a random sample of VC_BANK_SIZE words in the bank.
// Always includes the current target word; the rest are random distractors
// drawn from the remaining (not-yet-placed) tokens.
function refreshWordBank() {
    const bank = document.getElementById("vc-word-bank");
    bank.innerHTML = "";

    if (vcTargetIndex >= vcCurrentTokens.length) return;

    const targetWord = vcCurrentTokens[vcTargetIndex];

    // Collect indices of remaining tokens (excluding the current target)
    const remaining = [];
    for (let i = vcTargetIndex + 1; i < vcCurrentTokens.length; i++) {
        remaining.push(i);
    }
    shuffleArray(remaining);

    // Pick up to (VC_BANK_SIZE - 1) distractors
    const distractorIndices = remaining.slice(0, VC_BANK_SIZE - 1);

    // Combine target + distractors and shuffle the display order
    const bankEntries = [
        { word: targetWord, index: vcTargetIndex },
        ...distractorIndices.map(i => ({ word: vcCurrentTokens[i], index: i }))
    ];
    shuffleArray(bankEntries);

    bankEntries.forEach(t => {
        const el = document.createElement("div");
        el.className = "vc-word";
        el.dataset.index = t.index;
        el.dataset.word = t.word;

        if (typeof pinyinPro !== 'undefined' && /[\u4e00-\u9fa5]/.test(t.word)) {
            el.dataset.pinyin = pinyinPro.pinyin(t.word, { type: 'string' });
        } else {
            el.dataset.pinyin = "";
        }

        el.addEventListener("click", () => handleWordClick(el, t.index));
        bank.appendChild(el);
    });

    updateExistingWords();

}

async function startVerseGame() {
    const username = await window.leaderboardSystem.promptUsername();
    if (!username) return;

    resetVerseGame();

    const v = getSelectedVersion();
    vcCurrentTokens = tokenizeText(v.text);
    vcTargetIndex = 0;

    const display = document.getElementById("vc-verse-display");
    display.innerHTML = "";

    refreshWordBank();

    document.getElementById("vc-game-area").style.display = "block";
    document.getElementById("vc-start-btn").style.display = "none";

    const volCont = document.getElementById("vc-volume-control");
    if (volCont) volCont.style.display = "flex";

    vcStartTime = Date.now();
    vcGameActive = true;

    vcTimerInterval = setInterval(() => {
        const elapsed = (Date.now() - vcStartTime) / 1000;
        document.getElementById("vc-timer").textContent = elapsed.toFixed(1) + "s";
    }, 100);
}

function handleWordClick(el, tokenIndex) {
    if (!vcGameActive) return;

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const vTitle = getSelectedVersion().title;
        const textToSpeak = el.dataset.word;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        utterance.lang = vTitle.includes("Chinese") ? "zh-CN" : "en-US";
        const volumeSlider = document.getElementById("vc-volume-slider");
        if (volumeSlider) utterance.volume = parseFloat(volumeSlider.value);

        window.speechSynthesis.speak(utterance);
    }

    if (tokenIndex === vcTargetIndex) {
        // Correct word chosen
        const display = document.getElementById("vc-verse-display");

        const correctEl = document.createElement("div");
        correctEl.className = "vc-word vc-correct";
        correctEl.dataset.word = el.dataset.word;
        correctEl.dataset.pinyin = el.dataset.pinyin;
        display.appendChild(correctEl);
        // Auto-scroll the display area to always show the latest word
        display.scrollTop = display.scrollHeight;

        vcTargetIndex++;

        if (vcTargetIndex === vcCurrentTokens.length) {
            updateExistingWords();
            handleVictory();
        } else {
            refreshWordBank();
        }
    } else {
        el.classList.add("vc-word-error");
        setTimeout(() => el.classList.remove("vc-word-error"), 400);
    }
}

function handleVictory() {
    clearInterval(vcTimerInterval);
    vcGameActive = false;
    const elapsed = ((Date.now() - vcStartTime) / 1000);
    
    document.getElementById("vc-final-time").textContent = elapsed.toFixed(1) + "s";
    
    const v = getSelectedVersion();
    const gameId = window.location.pathname.replace(/\/$/, '') + "-" + v.title.replace(/\s+/g, '-');
    
    window.leaderboardSystem.submitScore(gameId, Math.round(elapsed * 1000));
    
    const bestTimes = JSON.parse(localStorage.getItem('vc-best-times') || '{}');
    const prevBest = bestTimes[gameId];
    
    const compMsg = document.getElementById("vc-comparison-message");
    if (!prevBest) {
        bestTimes[gameId] = elapsed;
        compMsg.textContent = "New personal best!";
    } else if (elapsed < prevBest) {
        const diff = (prevBest - elapsed).toFixed(1);
        bestTimes[gameId] = elapsed;
        compMsg.textContent = `New personal best! You beat your old score by ${diff}s.`;
    } else {
        const diff = (elapsed - prevBest).toFixed(1);
        compMsg.textContent = `${diff}s away from your personal best.`;
    }
    
    localStorage.setItem('vc-best-times', JSON.stringify(bestTimes));
    updateBestTimeDisplay();
    
    document.getElementById("vc-victory-message").style.display = "block";
    document.getElementById("vc-start-btn").style.display = "inline-block";
    document.getElementById("vc-start-btn").textContent = "Play Again";
    document.getElementById("vc-word-bank").innerHTML = "";

    const volCont = document.getElementById("vc-volume-control");
    if (volCont) volCont.style.display = "none";
}
