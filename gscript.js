document.addEventListener("DOMContentLoaded", function() {
    const roundSelection = document.getElementById("round-selection");
    const gameArea = document.getElementById("game-area");
    const buggyCodeDisplay = document.getElementById("buggy-code");
    const form = document.getElementById("bug-form");
    const inputField = document.getElementById("user_answer");
    const feedbackMessage = document.getElementById("feedback-message");
    const timerDisplay = document.getElementById("timer");
    const scoreDisplay = document.getElementById("current-score");
    const nextBugButton = document.getElementById("next-bug-button");
    const mediumButton = document.getElementById("medium-button");
    const hardButton = document.getElementById("hard-button");
    const unlockMessage = document.getElementById("unlock-message");

    let currentDifficulty = null;
    let timerInterval;
    let timerEndTime;
    let isTimerRunning = false;

    function updateUnlockStatus(score) {
        if (score < 100) {
            mediumButton.disabled = true;
            hardButton.disabled = true;
            unlockMessage.textContent = `Unlock Medium at 100 points, Hard at 150 points. Current score: ${score}`;
        } else if (score >= 100 && score < 150) {
            mediumButton.disabled = false;
            hardButton.disabled = true;
            unlockMessage.textContent = `Unlock Hard at 150 points. Current score: ${score}`;
        } else {
            mediumButton.disabled = false;
            hardButton.disabled = false;
            unlockMessage.textContent = `All difficulties unlocked! Current score: ${score}`;
        }
    }

    function updateTimer() {
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = timerEndTime - now;

        if (timeLeft <= 0 && isTimerRunning) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "Time's Up!";
            feedbackMessage.textContent = "⏰ Time's Up! Moving to the next bug.";
            isTimerRunning = false;
            setTimeout(loadNewBug, 1500);
        } else if (isTimerRunning) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    function loadNewBug() {
        if (!currentDifficulty) {
            console.error("Difficulty not selected before loading bug.");
            alert("Please select a difficulty first.");
            showRoundSelection();
            return;
        }
        fetch(`check.php?difficulty=${currentDifficulty}`)
            .then(response => response.json())
            .then(data => {
                console.log('Data received:', data);
                if (data.buggy_code !== undefined) {
                    buggyCodeDisplay.textContent = data.buggy_code;
                    scoreDisplay.textContent = data.score;
                    feedbackMessage.textContent = "";
                    inputField.value = "";
                    nextBugButton.style.display = "none";
                    timerEndTime = data.timer_end;
                    clearInterval(timerInterval);
                    isTimerRunning = true;
                    timerInterval = setInterval(updateTimer, 1000);
                    updateTimer();
                    updateUnlockStatus(data.score); // Update unlock status on new bug load
                } else if (data.error) {
                    alert(data.error);
                    showRoundSelection();
                }
            })
            .catch(error => {
                console.error("Error loading new bug:", error);
                alert("Failed to load the next bug.");
                showRoundSelection();
            });
    }

    window.startRound = function(difficulty) {
        if ((difficulty === 'medium' && parseInt(scoreDisplay.textContent) < 100) || (difficulty === 'hard' && parseInt(scoreDisplay.textContent) < 150)) {
            alert(`You need ${difficulty === 'medium' ? '100' : '150'} points to unlock ${difficulty} difficulty.`);
            return;
        }
        currentDifficulty = difficulty;
        roundSelection.style.display = "none";
        gameArea.style.display = "block";
        loadNewBug();
    };

    function showRoundSelection() {
        roundSelection.style.display = "block";
        gameArea.style.display = "none";
        currentDifficulty = null;
        clearInterval(timerInterval);
        isTimerRunning = false;
        updateUnlockStatus(parseInt(scoreDisplay.textContent)); // Update unlock status when showing selection
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        fetch("check.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            feedbackMessage.textContent = data.message;
            scoreDisplay.textContent = data.score;
            updateUnlockStatus(data.score); // Update unlock status on answer submission
            if (data.status === "correct") {
                clearInterval(timerInterval);
                isTimerRunning = false;
                feedbackMessage.textContent += " Loading next bug...";
                setTimeout(loadNewBug, 1500);
            }
        })
        .catch(error => {
            console.error("Error submitting answer:", error);
            feedbackMessage.textContent = "Failed to check your answer.";
        });
    });

    window.nextBug = function() {
        loadNewBug();
    };

    // Initial state
    fetch("check.php?difficulty=easy") // Load initial score and first easy bug
        .then(response => response.json())
        .then(data => {
            if (data.buggy_code !== undefined) {
                buggyCodeDisplay.textContent = data.buggy_code;
                scoreDisplay.textContent = data.score;
                timerEndTime = data.timer_end;
                clearInterval(timerInterval);
                isTimerRunning = true;
                timerInterval = setInterval(updateTimer, 1000);
                updateTimer();
                updateUnlockStatus(data.score);
                gameArea.style.display = "block"; // Show game area after loading first bug
                roundSelection.style.display = "none"; // Hide selection
                currentDifficulty = 'easy'; // Set initial difficulty
            } else {
                showRoundSelection();
                updateUnlockStatus(0); // Initialize unlock status
            }
        })
        .catch(error => {
            console.error("Error loading initial bug:", error);
            showRoundSelection();
            updateUnlockStatus(0); // Initialize unlock status
        });
});
