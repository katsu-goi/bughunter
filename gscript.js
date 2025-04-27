// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4shH6owP4rwuYTwEIcRjaZRJh5p6b_6s",
  authDomain: "apexgames-a5903.firebaseapp.com",
  projectId: "apexgames-a5903",
  storageBucket: "apexgames-a5903.firebasestorage.app",
  messagingSenderId: "927388647652",
  appId: "1:927388647652:web:f065997c4969510b056cf1",
  measurementId: "G-B5GKRLC8X7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

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
      const user = auth.currentUser;
      if (user) {
        // Optionally save the current score even if time runs out
        const userId = user.uid;
        const score = parseInt(scoreDisplay.textContent);
        const leaderboardCollection = collection(db, 'leaderboard');
        const userDocRef = doc(leaderboardCollection, userId);
        setDoc(userDocRef, { username: user.displayName || 'Anonymous', score: score, timestamp: serverTimestamp() }, { merge: true });
      }
      setTimeout(loadNewBug, 1500);
    } else if (isTimerRunning) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `<span class="math-inline">\{String\(minutes\)\.padStart\(2, '0'\)\}\:</span>{String(seconds).padStart(2, '0')}`;
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

  function handleCorrectAnswer(pointsEarned) {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const currentScore = parseInt(scoreDisplay.textContent);
      const newScore = currentScore + pointsEarned;

      const leaderboardCollection = collection(db, 'leaderboard');
      const userDocRef = doc(leaderboardCollection, userId);

      setDoc(userDocRef, {
        username: user.displayName || 'Anonymous', // Use display name if available
        score: newScore,
        timestamp: serverTimestamp()
      }, { merge: true }) // Use merge to update if the document exists
      .then(() => {
        console.log('Score saved to leaderboard!');
      })
      .catch((error) => {
        console.error('Error saving score:', error);
      });
    } else {
      console.log('User not logged in, cannot save score.');
    }
  }

  function getCurrentPoints() {
    if (currentDifficulty === 'easy') return 1;
    if (currentDifficulty === 'medium') return 3;
    if (currentDifficulty === 'hard') return 5;
    return
