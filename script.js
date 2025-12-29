let eventDatabase = []; // Initializing the empty database

// This logic runs the moment the webpage is opened
window.onload = async function() {
    try {
        // Fetching the events from your new events.json file
        const response = await fetch('events.json');
        if (!response.ok) throw new Error("Could not find events.json");
        eventDatabase = await response.json();
        console.log("Database Loaded: " + eventDatabase.length + " events.");
    } catch (error) {
        console.error("Error loading events database:", error);
        alert("Failed to load game data. Check if events.json exists in your GitHub repo.");
    }
};

// GAME STATE
let currentRoundEvents = [];

// LOGIC: Starting a New Game
function startNewGame() {
    const difficulty = document.getElementById("difficulty-select").value;
    
    // UI Transitions
    document.getElementById("setup-area").style.display = "none";
    document.getElementById("game-area").style.display = "block";
    document.getElementById("player-input").value = "";

    // 1. Pick a random 10-year range (1950-1980)
    const startYear = Math.floor(Math.random() * (1980 - 1950 + 1)) + 1950;
    const endYear = startYear + 9;

    // 2. Select exactly one event per year
    let selectedEvents = [];
    for (let y = startYear; y <= endYear; y++) {
        let possibleEvents = eventDatabase.filter(e => e.year === y && e.level === difficulty);
        
        // Fallback to any level if the specific difficulty is missing for a year
        if (possibleEvents.length === 0) {
            possibleEvents = eventDatabase.filter(e => e.year === y);
        }

        const randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
        if (randomEvent) {
            selectedEvents.push({...randomEvent});
        }
    }

    // 3. Shuffle for the player
    currentRoundEvents = [...selectedEvents].sort(() => Math.random() - 0.5);

    // 4. Send to the UI (this calls the function you already have)
    displayEvents(currentRoundEvents);
}

function displayEvents(events) {
  const listElement = document.getElementById("event-list");
  listElement.innerHTML = ""; // Clear old list

  events.forEach((event, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${index + 1}:</strong> ${event.desc}`;
    listElement.appendChild(li);
  });
}

// 5. LOGIC: Checking the Answer
function checkAnswers() {
    const playerInput = document.getElementById("player-input").value;
    const playerIndices = playerInput.split(",").map(n => parseInt(n.trim()) - 1);
    const correctOrder = [...currentRoundEvents].sort((a, b) => a.year - b.year);

    document.getElementById("game-area").style.display = "none";
    document.getElementById("results-area").style.display = "block";
    
    const correctList = document.getElementById("correct-list");
    correctList.innerHTML = "";
    let correctCount = 0;

    correctOrder.forEach((event, index) => {
        const originalIndex = currentRoundEvents.indexOf(event);
        const playerChoiceAtThisPosition = playerIndices[index];
        
        // Check if the player's number at this chronological spot matches the event's original label
        const isCorrect = playerChoiceAtThisPosition === originalIndex;
        if (isCorrect) correctCount++;

        const li = document.createElement("li");
        // Apply CSS class based on accuracy
        li.className = isCorrect ? "result-correct" : "result-incorrect";
        
        li.innerHTML = `
            <strong>${isCorrect ? "✓" : "✗"} Event #${originalIndex + 1}:</strong> ${event.desc}
            <span class="date-reveal">Date: ${event.date}</span>
        `;
        correctList.appendChild(li);
    });

    // Display total score
    document.getElementById("score-summary").innerHTML = `
        <h2 style="color: ${correctCount === 10 ? '#00ff66' : '#ffcc00'}">
            Final Score: ${correctCount} / 10
        </h2>
        <p>${getFeedback(correctCount)}</p>
    `;
}

function getFeedback(score) {
    if (score === 10) return "Perfect! A master of history.";
    if (score >= 7) return "Great job! You really know your eras.";
    if (score >= 4) return "Not bad, but those mid-years are tricky!";
    return "History is tough! Give it another shot.";
}

// 6. LOGIC: Resetting the Game
function resetGame() {
    document.getElementById("results-area").style.display = "none";
    document.getElementById("setup-area").style.display = "block";
    document.getElementById("player-input").value = "";
}

// Overwriting startNewGame slightly to ensure UI transitions properly
const originalStart = startNewGame;
startNewGame = function() {
    document.getElementById("setup-area").style.display = "none";
    document.getElementById("game-area").style.display = "block";
    originalStart(); 
};
