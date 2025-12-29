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
    
    // Convert the player's "5,2,3..." string into an array of numbers
    // We subtract 1 because arrays start at 0, but your labels start at 1
    const playerIndices = playerInput.split(",").map(n => parseInt(n.trim()) - 1);

    // Create the correct chronological order by sorting the round events by year
    const correctOrder = [...currentRoundEvents].sort((a, b) => a.year - b.year);

    // Prepare the Results UI
    document.getElementById("game-area").style.display = "none";
    document.getElementById("results-area").style.display = "block";
    
    const correctList = document.getElementById("correct-list");
    correctList.innerHTML = ""; // Clear previous results

    // Display the events in CORRECT chronological order
    correctOrder.forEach((event) => {
        // Find what number this event had in the random list (for player comparison)
        const originalIndex = currentRoundEvents.indexOf(event) + 1;
        
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>Event #${originalIndex}:</strong> ${event.desc}
            <span class="date-reveal">Date: ${event.date}</span>
        `;
        correctList.appendChild(li);
    });

    // Provide a basic score summary
    document.getElementById("score-summary").innerHTML = `
        <p>Review the chronological order above and see how you did!</p>
    `;
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
