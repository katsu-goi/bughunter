<?php
session_start();
include "bug_data.php";

// Error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (!isset($_SESSION['score'])) {
    $_SESSION['score'] = 0;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_answer = trim($_POST["user_answer"]);
    if (isset($_SESSION['current_bug']) && isset($_SESSION['current_difficulty'])) {
        $bug = $_SESSION['current_bug'];
        $difficulty = $_SESSION['current_difficulty'];
        $points = 0;

        if ($difficulty === 'easy') {
            $points = 1;
        } elseif ($difficulty === 'medium') {
            $points = 3;
        } elseif ($difficulty === 'hard') {
            $points = 5;
        }

        if ($user_answer === $bug["correct_answer"]) {
            $_SESSION['score'] += $points;
            echo json_encode(["status" => "correct", "message" => "✅ Correct! You earned " . $points . " points!", "score" => $_SESSION['score']]);
            unset($_SESSION['current_bug']); // Reset for next round
            unset($_SESSION['timer_end']); // Clear timer
        } else {
            echo json_encode(["status" => "incorrect", "message" => "❌ Incorrect! Try again!"]);
        }
        exit();
    } else {
        error_log("Error: Session data for current bug or difficulty not set on POST request.");
        echo json_encode(["error" => "An error occurred while processing your answer."]);
        exit();
    }
}

function getRandomBug($bugs, $difficulty) {
    $filteredBugs = array_filter($bugs, function ($bug) use ($difficulty) {
        return $bug['difficulty'] === $difficulty;
    });

    if (empty($filteredBugs)) {
        error_log("Warning: No bugs found for difficulty: " . $difficulty);
        return null;
    }

    $randomIndex = array_rand($filteredBugs);
    return $filteredBugs[$randomIndex];
}

if (!isset($_SESSION['current_bug'])) {
    if (isset($_GET['difficulty'])) {
        $difficulty = $_GET['difficulty'];
        $_SESSION['current_difficulty'] = $difficulty;
        $bug = getRandomBug($bugs, $difficulty);
        if ($bug) {
            $_SESSION['current_bug'] = $bug;
            $timerDuration = 0;
            if ($difficulty === 'easy') {
                $timerDuration = 30;
            } elseif ($difficulty === 'medium') {
                $timerDuration = 60;
            } elseif ($difficulty === 'hard') {
                $timerDuration = 90;
            }
            $_SESSION['timer_end'] = time() + $timerDuration;
            echo json_encode(["buggy_code" => $bug["buggy_code"], "score" => $_SESSION['score'], "timer_end" => $_SESSION['timer_end']]);
            exit();
        } else {
            echo json_encode(["error" => "No bugs available for this difficulty."]);
            exit();
        }
    } else {
        error_log("Error: Difficulty not specified in GET request.");
        echo json_encode(["error" => "Difficulty level not provided."]);
        exit();
    }
} else {
    // If a bug is already loaded, just send it back with the current timer end
    echo json_encode(["buggy_code" => $_SESSION['current_bug']['buggy_code'], "score" => $_SESSION['score'], "timer_end" => $_SESSION['timer_end']]);
    exit();
}
?>