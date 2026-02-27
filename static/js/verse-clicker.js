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

    window.vcVersions = versions;
    initVerseGameUI();
});

let vcTimerInterval;
let vcStartTime;
let vcGameActive = false;
let vcCurrentTokens = [];
let vcTargetIndex = 0;

function getSelectedVersion() {
    const radio = document.querySelector('input[name="vc-language-toggle"]:checked');
    if (!radio) return window.vcVersions[0];
    return window.vcVersions[parseInt(radio.value)];
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
            resetVerseGame();
        });

        label.appendChild(radio);
        label.appendChild(document.createTextNode(" " + v.title));
        langContainer.appendChild(label);
    });
    
    updateBestTimeDisplay();
}

function tokenizeText(text) {
    return text.trim().split(/\s+/).filter(w => w.length > 0);
}

function updateBestTimeDisplay() {
    const v = getSelectedVersion();
    const gameId = window.location.pathname + "-" + v.title;
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
    
    // Check if new mode is selected
    updateBestTimeDisplay();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startVerseGame() {
    resetVerseGame(); 
    
    const v = getSelectedVersion();
    vcCurrentTokens = tokenizeText(v.text);
    vcTargetIndex = 0;
    
    const display = document.getElementById("vc-verse-display");
    const bank = document.getElementById("vc-word-bank");
    
    display.innerHTML = "";
    bank.innerHTML = "";
    
    let bankTokens = Array.from(vcCurrentTokens).map((word, i) => ({ word, index: i }));
    shuffleArray(bankTokens);
    
    bankTokens.forEach(t => {
        const el = document.createElement("div");
        el.className = "vc-word";
        el.textContent = t.word;
        el.dataset.index = t.index;
        
        el.addEventListener("click", () => handleWordClick(el, t.index));
        bank.appendChild(el);
    });
    
    document.getElementById("vc-game-area").style.display = "block";
    document.getElementById("vc-start-btn").style.display = "none";
    
    vcStartTime = Date.now();
    vcGameActive = true;
    
    vcTimerInterval = setInterval(() => {
        const elapsed = (Date.now() - vcStartTime) / 1000;
        document.getElementById("vc-timer").textContent = elapsed.toFixed(1) + "s";
    }, 100);
}

function handleWordClick(el, tokenIndex) {
    if (!vcGameActive) return;
    
    if (el.textContent === vcCurrentTokens[vcTargetIndex]) {
        const bank = document.getElementById("vc-word-bank");
        const display = document.getElementById("vc-verse-display");
        
        bank.removeChild(el);
        
        const correctEl = document.createElement("div");
        correctEl.className = "vc-word vc-correct";
        correctEl.textContent = el.textContent;
        display.appendChild(correctEl);
        
        vcTargetIndex++;
        
        if (vcTargetIndex === vcCurrentTokens.length) {
            handleVictory();
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
    const gameId = window.location.pathname + "-" + v.title;
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
}
