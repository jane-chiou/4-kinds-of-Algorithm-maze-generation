/**
 * Replace all occurrences of oldVal with newVal in the given array.
 * @param {Array} arr - The array to modify.
 * @param {*} oldVal - The value to replace.
 * @param {*} newVal - The value to insert.
 */
function replace(arr, oldVal, newVal) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === oldVal) arr[i] = newVal;
    }
}

// Set the default maze dimensions
let mazeWidth = 25;   // Number of columns
let mazeHeight = 20;  // Number of rows

// Create a new View instance for drawing
let view = new View();

// Store the current maze data
let maze;

// Animation control variable to prevent overlapping animations
let animationId = 0;

/**
 * Animate the generation of a maze using Eller's Algorithm.
 * Each row is generated and drawn with a delay for animation effect.
 * @param {number} height - Number of rows in the maze.
 * @param {number} width - Number of columns in the maze.
 * @param {View} view - The View instance for drawing.
 * @param {number} delay - Delay in milliseconds between each row.
 * @param {number} prob - Probability parameter for random wall removal.
 * @param {number} myId - Unique animation ID to control concurrent animations.
 */
async function animateEller(height, width, view, delay = 100, prob = 0.5, myId = 0) {
    // Initialize the maze as a 2D array filled with 0 (no walls)
    let localMaze = Array.from({length: height}, () => Array(width).fill(0));
    // Each cell in the current row belongs to an "area" (set)
    let areas = Array.from({length: width}, (_, i) => i);
    // Next available area number for new sets
    let nextArea = width;

    // Process each row of the maze
    for (let i = 0; i < height; i++) {
        // If a new animation has started, stop this one
        if (myId !== animationId) return;

        // Step 1: Decide where to remove right walls between adjacent cells
        for (let j = 0; j < width - 1; j++) {
            // If adjacent cells are in different areas and random chance passes, merge areas
            if (areas[j] !== areas[j+1] && Math.random() > prob) {
                replace(areas, areas[j+1], areas[j]);
            } else {
                // Otherwise, add a right wall (bit 1)
                localMaze[i][j] |= 1;
            }
        }

        // Step 2: If this is the last row, ensure all areas are merged
        if (i === height - 1) {
            for (let j = 0; j < width - 1; j++) {
                if (areas[j] !== areas[j+1]) {
                    replace(areas, areas[j+1], areas[j]);
                    // Remove right wall to connect areas
                    localMaze[i][j] &= ~1;
                }
            }
            // Draw the final maze state
            view.drawMaze(localMaze);
            maze = localMaze;
            break;
        }

        // Step 3: Decide where to remove bottom walls to connect to the next row
        let areaCount = {};
        // Count how many cells are in each area
        for (let a of areas) areaCount[a] = (areaCount[a] || 0) + 1;
        for (let j = 0; j < width; j++) {
            let cell = areas[j];
            // If area has more than one cell and random chance passes, create a new area below
            if (areaCount[cell] > 1 && Math.random() < prob) {
                areaCount[cell]--;
                areas[j] = nextArea++;
                // Add a bottom wall (bit 2)
                localMaze[i][j] |= 2;
            }
        }

        // Draw the current maze state after processing this row
        view.drawMaze(localMaze);
        // Wait for the specified delay before processing the next row
        await new Promise(res => setTimeout(res, delay));
    }
    // Save the final maze state
    maze = localMaze;
}

// Start the maze animation on page load
animationId++;
animateEller(mazeHeight, mazeWidth, view, 1000, 0.5, animationId);

// When the canvas is clicked, start a new maze animation and stop the previous one
document.addEventListener("click", function() {
    animationId++;
    animateEller(mazeHeight, mazeWidth, view, 1000, 0.5, animationId);
});

// Press "h" to hide/show the instruction text
document.addEventListener("keydown", function(e) {
    if (e.key === "h" || e.key === "H") {
        view.hideText = !view.hideText;
        view.drawMaze(maze);
    }
});