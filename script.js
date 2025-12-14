// Robot Maze Game - JavaScript
// Dit script bevat alle game logica voor het robot doolhof spel

// Constanten
const CELL_SIZE = 50; // Grootte van elke cel in pixels (moet overeenkomen met CSS)

// Game state variabelen
let robotPosition = { x: 1, y: 1 }; // Start positie van de robot
let finishPosition = { x: 8, y: 8 }; // Positie van de finish

// Doolhof definitie als 2D array
// 0 = vloer (waar de robot kan lopen)
// 1 = muur (waar de robot niet doorheen kan)
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Functie om het game grid te renderen
function renderGrid() {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = ''; // Maak het grid leeg
    
    // Stel het aantal kolommen in voor het CSS grid
    gameGrid.style.gridTemplateColumns = `repeat(${maze[0].length}, ${CELL_SIZE}px)`;
    
    // Loop door elke rij in het doolhof
    for (let y = 0; y < maze.length; y++) {
        // Loop door elke kolom in de huidige rij
        for (let x = 0; x < maze[y].length; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // Bepaal wat er in deze cel moet komen
            if (x === robotPosition.x && y === robotPosition.y) {
                // Robot positie
                cell.textContent = '🤖';
                cell.classList.add('robot');
                
                // Als robot op finish staat
                if (x === finishPosition.x && y === finishPosition.y) {
                    cell.classList.add('finish');
                }
            } else if (x === finishPosition.x && y === finishPosition.y) {
                // Finish positie
                cell.textContent = '🏁';
                cell.classList.add('finish');
            } else if (maze[y][x] === 1) {
                // Muur
                cell.textContent = '🧱';
                cell.classList.add('wall');
            } else {
                // Lege vloer
                cell.classList.add('floor');
            }
            
            gameGrid.appendChild(cell);
        }
    }
}

// Functie om te checken of een positie geldig is (geen muur en binnen het grid)
function isValidPosition(x, y) {
    // Check of de positie binnen het grid valt
    if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) {
        return false;
    }
    
    // Check of de positie geen muur is
    return maze[y][x] === 0;
}

// Functie om de robot te bewegen
function moveRobot(dx, dy) {
    const newX = robotPosition.x + dx;
    const newY = robotPosition.y + dy;
    
    // Check of de nieuwe positie geldig is
    if (isValidPosition(newX, newY)) {
        // Update de robot positie
        robotPosition.x = newX;
        robotPosition.y = newY;
        
        // Render het grid opnieuw
        renderGrid();
        
        // Check of de robot de finish heeft bereikt
        checkWinCondition();
    }
}

// Functie om te checken of de speler heeft gewonnen
function checkWinCondition() {
    if (robotPosition.x === finishPosition.x && robotPosition.y === finishPosition.y) {
        // Wacht een klein moment zodat de speler de robot op de finish ziet
        setTimeout(showWinMessage, 300);
    }
}

// Functie om de win melding te tonen
function showWinMessage() {
    const winMessage = document.getElementById('win-message');
    winMessage.classList.remove('hidden');
}

// Functie om de win melding te verbergen
function hideWinMessage() {
    const winMessage = document.getElementById('win-message');
    winMessage.classList.add('hidden');
}

// Functie om het spel te resetten
function resetGame() {
    // Zet de robot terug naar de start positie
    robotPosition = { x: 1, y: 1 };
    
    // Verberg de win melding
    hideWinMessage();
    
    // Render het grid opnieuw
    renderGrid();
}

// Functie om event listeners in te stellen en het spel te starten
function initGame() {
    // Event listener voor keyboard input
    document.addEventListener('keydown', (event) => {
        // Voorkom standaard scroll gedrag van pijltjestoetsen
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
        
        // Handle de verschillende pijltjestoetsen
        switch(event.key) {
            case 'ArrowUp':
                moveRobot(0, -1); // Beweeg omhoog (y-1)
                break;
            case 'ArrowDown':
                moveRobot(0, 1); // Beweeg omlaag (y+1)
                break;
            case 'ArrowLeft':
                moveRobot(-1, 0); // Beweeg naar links (x-1)
                break;
            case 'ArrowRight':
                moveRobot(1, 0); // Beweeg naar rechts (x+1)
                break;
        }
    });

    // Event listener voor de reset button
    document.getElementById('reset-button').addEventListener('click', resetGame);

    // Event listener voor de "nog een keer spelen" button
    document.getElementById('play-again').addEventListener('click', resetGame);

    // Start het spel door het grid te renderen
    renderGrid();
}

// Wacht tot de DOM volledig geladen is voordat het spel start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOM is al geladen
    initGame();
}
