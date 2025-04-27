<?php
session_start();

if (!isset($_SESSION['score'])) {
    $_SESSION['score'] = 0;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bug Hunter</title>
    <link rel="stylesheet" href="gstyles.css">
</head>
<body>
    <div class="game-container">
        <h1>Bug Hunter</h1>
        <div id="round-selection">
            <h2>Select Difficulty</h2>
            <button onclick="startRound('easy')">Easy (1 Point)</button>
            <button onclick="startRound('medium')" id="medium-button" disabled>Medium (3 Points)</button>
            <button onclick="startRound('hard')" id="hard-button" disabled>Hard (5 Points)</button>
            <div id="unlock-message" style="margin-top: 10px; font-size: 0.9em; color: gray;"></div>
        </div>
        <div id="game-area" style="display: none;">
            <h2>Fix the Bug!</h2>
            <div class="code-box" id="buggy-code"></div>
            <form id="bug-form">
                <input type="text" id="user_answer" placeholder="Enter the corrected code">
                <button type="submit">Submit Fix</button>
            </form>
            <div class="feedback" id="feedback-message"></div>
            <div class="game-info">
                <div class="timer">Time Left: <span id="timer"></span></div>
                <div class="score">Score: <span id="current-score">0</span></div>
            </div>
            <button onclick="nextBug()" id="next-bug-button" style="display: none;">Next Bug</button>
        </div>
    </div>

    <script src="gscript.js"></script>
</body>
</html>
