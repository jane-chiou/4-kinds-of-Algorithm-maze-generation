// global variables (feel free to edit these values)
let mazeWidth = 30;
let mazeHeight = 30;
let algorithmIterations = mazeWidth * mazeHeight; // limit iterations to maze size
let animationFPS = 3; // frames per second
let drawArrow = false; // whether to show the direction of each node or not. Toggle with "a" key
let highlightOrigin = true; // whether to highlight the origin node or not. Toggle with "o" key
let hideText = false; // Toggle with "h" key
let animate = false; // whether to animate the algorithm or not. Toggle with space bar
let iterateOrNot = true; // whether to iterate or not. Toggle with "i" key

class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        console.log(`Maze dimensions: ${width}x${height}`);
        this.map = this.newMap(); // the array of nodes defining the maze
        this.stack = []; // stack to track cells being processed
        this.origin = null; // initialize origin as null
    }

    // Initialize maze map with all walls
    newMap() {
        let map = [];
        for (let y = 0; y < this.height; y++) {
            map.push([]);
            for (let x = 0; x < this.width; x++) {
                map[y].push(1); // 1 indicates a wall
            }
        }
        console.log("New map created:", map);
        return map;
    }

    // Set up the maze with Binary Tree Algorithm starting point
    initialize() {
        console.log("Initializing maze with Binary Tree Algorithm...");
        this.map = this.newMap(); // reset map with all walls
        this.stack = [];

        // Set starting cell at (0,0)
        let startX = 0;
        let startY = 0;
        this.origin = { x: startX, y: startY };
        this.map[startY][startX] = 0; // 0 indicates a passage
        this.stack.push({ x: startX, y: startY });
        console.log("Maze initialized with start at:", this.origin);
    }

    // Perform one iteration of the Binary Tree Algorithm
    iterate() {
        if (this.stack.length === 0) {
            console.log("Maze generation complete.");
            return false; // no more cells to process
        }

        // Get the current cell from the top of the stack
        let current = this.stack[this.stack.length - 1];
        let x = current.x;
        let y = current.y;

        // Check possible neighbors (right and bottom)
        let neighbors = [];
        if (x < this.width - 1 && this.map[y][x + 1] === 1) {
            neighbors.push({ x: x + 1, y: y }); // right neighbor
        }
        if (y < this.height - 1 && this.map[y + 1][x] === 1) {
            neighbors.push({ x: x, y: y + 1 }); // bottom neighbor
        }

        if (neighbors.length > 0) {
            // Randomly choose a neighbor to connect
            let chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
            this.map[chosen.y][chosen.x] = 0; // carve passage
            this.stack.push(chosen); // add new cell to stack
            console.log(`Carved passage to (${chosen.x}, ${chosen.y})`);
        } else {
            // No valid neighbors, remove current cell from stack
            this.stack.pop();
            console.log(`Backtracked from (${x}, ${y})`);
        }
        return true; // indicate that an iteration occurred
    }
}

// Create maze and view objects
let maze = new Maze(mazeWidth, mazeHeight);
maze.initialize(); // initialize maze
let view = new View();

view.drawMaze(maze, highlightOrigin, hideText);

// Main animation loop
function mainLoop() {
    console.log("animating...");
    maze.iterate();
    view.drawMaze(maze, highlightOrigin, hideText);
    if (animate) setTimeout(mainLoop, 1000 / animationFPS);
    else console.log("animation stopped");
}

// Event listeners
document.addEventListener("contextmenu", function(event) {
    event.preventDefault(); // prevent default right-click menu
    let start = Date.now();
    if (iterateOrNot === true) {
        // Run iterations until maze is complete or max iterations reached
        let i = 0;
        while (maze.iterate() && i < algorithmIterations) {
            i++;
        }
        console.log(`Performed ${i} iterations.`);
    } else {
        maze = new Maze(mazeWidth, mazeHeight);
        maze.initialize();
        maze.iterate();
        iterateOrNot = true;
        console.log("Maze reinitialized");
    }
    let end = Date.now();
    console.log(`Execution time: ${end - start} milliseconds`);
    view.drawMaze(maze, highlightOrigin, hideText);
});

document.addEventListener("keydown", function(event) {
    console.log(`Key pressed: ${event.key}`);
    event.preventDefault();
    switch (event.key) {
        case " ":
            animate = !animate;
            if (animate) mainLoop();
            break;
        case "i":
            maze.iterate();
            view.drawMaze(maze, highlightOrigin, hideText);
            break;
        case "o":
            highlightOrigin = !highlightOrigin;
            console.log(highlightOrigin);
            view.drawMaze(maze, highlightOrigin, hideText);
            break;
        case "h":
            hideText = !hideText;
            view.drawMaze(maze, highlightOrigin, hideText);
            break;
        default:
            break;
    }
});

// Helper function
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // min inclusive, max exclusive
}