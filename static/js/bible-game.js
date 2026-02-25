const otBooks = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
    "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
];

const ntBooks = [
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
    "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
    "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
    "1 John", "2 John", "3 John", "Jude", "Revelation"
];

let targetSequence = [];
let currentIndex = 0;
let timerInterval = null;
let startTime = 0;
let gameActive = false;
let currentMode = '';
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
        targetDisplay.innerText = targetSequence[currentIndex];
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
            const name = btn.innerText.toLowerCase();
            // Allow matching the start of the name, ignoring numbers (e.g. "John" matches "1 John")
            const nameWithoutNumber = name.replace(/^\d+\s+/, '');

            if (name.startsWith(term) || nameWithoutNumber.startsWith(term)) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        });
    });

    // Make functions globally available if needed by onclick attributes
    window.startGame = function (mode) {
        // Stop existing game/timer
        clearInterval(timerInterval);
        victoryMessage.style.display = 'none';
        currentIndex = 0;
        timerDisplay.innerText = "0.0s";
        gameActive = true;
        currentMode = mode;

        // Update Best Time Display for this mode
        const savedBest = localStorage.getItem('bible_speedrun_best_' + mode);
        bestDisplay.innerText = savedBest ? parseFloat(savedBest).toFixed(1) + "s" : "--";

        // Determine sequence based on mode
        if (mode === 'ot') targetSequence = [...otBooks];
        else if (mode === 'nt') targetSequence = [...ntBooks];
        else targetSequence = [...otBooks, ...ntBooks];

        // Update display to show the first book to find
        updateTargetDisplay();

        // Create a shuffled array for the visual board
        let shuffledBooks = [...targetSequence];
        shuffleArray(shuffledBooks);

        // Render board
        board.innerHTML = '';
        shuffledBooks.forEach(book => {
            const btn = document.createElement('button');
            btn.className = 'book-btn';
            btn.innerText = book;
            btn.onclick = () => handleBookClick(book, btn);
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

    function handleBookClick(clickedBook, btnElement) {
        if (!gameActive) return;
        if (btnElement.disabled) return;

        // Read the clicked book out loud
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(clickedBook);
            const volumeSlider = document.getElementById('volume-slider');
            if (volumeSlider) {
                utterance.volume = parseFloat(volumeSlider.value);
            }
            window.speechSynthesis.speak(utterance);
        }

        const targetBook = targetSequence[currentIndex];

        if (clickedBook === targetBook) {
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
        targetSequence.forEach(book => {
            const div = document.createElement('div');
            div.className = 'book-btn correct';
            div.innerText = book;
            board.appendChild(div);
        });

        // Handle High Score Logic (per mode)
        const storageKey = 'bible_speedrun_best_' + currentMode;
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
