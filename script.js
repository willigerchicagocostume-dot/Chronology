// 1. DATA: The event database (A small starter sample)
const eventDatabase = [
  // 1950s
  { year: 1950, level: "medium", date: "June 25, 1950", desc: "Outbreak of the Korean War." },
  { year: 1951, level: "medium", date: "October 15, 1951", desc: "The first episode of 'I Love Lucy' airs on CBS." },
  { year: 1952, level: "hard",   date: "November 1, 1952", desc: "First test of a hydrogen bomb (Ivy Mike) in the Marshall Islands." },
  { year: 1953, level: "medium", date: "June 19, 1953", desc: "Execution of Julius and Ethel Rosenberg." },
  { year: 1954, level: "medium", date: "May 17, 1954", desc: "Brown v. Board of Education Supreme Court ruling." },
  { year: 1955, level: "medium", date: "December 1, 1955", desc: "Rosa Parks refuses to give up her bus seat." },
  { year: 1956, level: "hard",   date: "June 29, 1956", desc: "Federal Aid Highway Act signed, creating the Interstate System." },
  { year: 1957, level: "medium", date: "September 4, 1957", desc: "The Little Rock Nine integrate Central High School." },
  { year: 1958, level: "hard",   date: "January 31, 1958", desc: "Explorer 1, the first US satellite, is launched." },
  { year: 1959, level: "medium", date: "February 3, 1959", desc: "'The Day the Music Died' (plane crash kills Buddy Holly)." },
  
  // 1960s
  { year: 1960, level: "medium", date: "September 26, 1960", desc: "First televised presidential debate (Kennedy vs. Nixon)." },
  { year: 1961, level: "hard",   date: "May 4, 1961", desc: "The first Freedom Riders depart Washington D.C." },
  { year: 1962, level: "medium", date: "October 16-29, 1962", desc: "The Cuban Missile Crisis." },
  { year: 1963, level: "medium", date: "August 28, 1963", desc: "Martin Luther King Jr. delivers 'I Have a Dream' speech." },
  { year: 1964, level: "hard",   date: "January 8, 1964", desc: "LBJ declares a 'War on Poverty' during State of the Union." },
  { year: 1965, level: "medium", date: "August 6, 1965", desc: "Voting Rights Act is signed into law." },
  { year: 1966, level: "hard",   date: "June 13, 1966", desc: "Miranda v. Arizona ruling (Miranda Rights)." },
  { year: 1967, level: "medium", date: "Summer 1967", desc: "The 'Summer of Love' in San Francisco." },
  { year: 1968, level: "medium", date: "April 4, 1968", desc: "Assassination of Martin Luther King Jr." },
  { year: 1969, level: "medium", date: "July 20, 1969", desc: "Apollo 11 Moon Landing." }
  // (You will add more events for 1970-1989 here)
];

// 2. GAME STATE
let currentRoundEvents = [];

// 3. LOGIC: Starting a New Game
function startNewGame() {
  const difficulty = document.getElementById("difficulty-select").value; // 'medium' or 'hard'
  
  // A. Pick a random start year between 1950 and 1980
  const startYear = Math.floor(Math.random() * (1980 - 1950 + 1)) + 1950;
  const endYear = startYear + 9;

  // B. Get 1 event for each year in the 10-year range
  let selectedEvents = [];
  for (let y = startYear; y <= endYear; y++) {
    // Filter database for this year AND level
    let possibleEvents = eventDatabase.filter(e => e.year === y && e.level === difficulty);
    
    // If no specific difficulty event exists, fallback to whatever is available for that year
    if (possibleEvents.length === 0) {
      possibleEvents = eventDatabase.filter(e => e.year === y);
    }

    // Pick one random event from the matches
    const randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
    if (randomEvent) selectedEvents.push({...randomEvent});
  }

  // C. Shuffle the order of events for the player
  currentRoundEvents = [...selectedEvents].sort(() => Math.random() - 0.5);

  displayEvents(currentRoundEvents);
}

// 4. UI: Displaying the events
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
