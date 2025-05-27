/*
Maze Generator Algorithm by CaptainLuma
Last Updated 1/12/2024
*/

// global variables (feel free to edit these values)
let mazeWidth = 10;
let mazeHeight = 10;
let algorithmIterations = mazeWidth * mazeHeight * 10; // how many iterations should be performed when running the algorithm
let animationFPS = 24; // frames per second
let drawArrow = false; // whether to show the direction of each node or not. Toggle with "a" key
let highlightOrigin = true; // wether to highlight the origin node or not. Toggle with "o" key
let hideText = false; // Toggle with "h" keyg
let animate = false; //  whether to animate the algorithm or not. Toggle with space bar

class Node {
    constructor(directionX = 0, directionY = 0) {
        this.direction = {x: directionX, y: directionY};
    }

    setDirection(x, y) {
        this.direction.x = x;
        this.direction.y = y;
    }
}

class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.map = this.newMap();
        this.visited = Array.from({ length: height }, () => Array(width).fill(false));
        // Choose a random starting point
        const startX = getRandomInt(0, width);
        const startY = getRandomInt(0, height);
        this.origin = { x: startX, y: startY };
        this.stack = [{ x: startX, y: startY }];
        this.visited[startY][startX] = true;
        this.possibleDirections = [
            { x: -1, y: 0 }, // left
            { x: 0, y: -1 }, // up
            { x: 1, y: 0 },  // right
            { x: 0, y: 1 }   // down
        ];
    }

    // returns a map of a valid maze
    newMap() {
        let map = [];
        for (let y = 0; y < this.height; y++) {
            map.push([]);
            for (let x = 0; x < this.width; x++) {
                map[y].push(new Node(0, 0));
            }
        }
        return map;
    }

    setOrigin(x, y) {
        this.origin.x = x;
        this.origin.y = y;
    }

    // performs one iteration of the DFS algorithm
    iterate() {
        if (this.stack.length === 0) return;

        let current = this.stack[this.stack.length - 1];
        let { x, y } = current;

        // Find all unvisited neighbors
        let neighbors = [];
        for (let dir of this.possibleDirections) {
            let nx = x + dir.x;
            let ny = y + dir.y;
            if (
                nx >= 0 && nx < this.width &&
                ny >= 0 && ny < this.height &&
                !this.visited[ny][nx]
            ) {
                neighbors.push({ x: nx, y: ny, dir });
            }
        }

        if (neighbors.length > 0) {
            // Choose a random neighbor
            let next = neighbors[getRandomInt(0, neighbors.length)];
            // Carve passage from current to next
            this.map[y][x].setDirection(next.dir.x, next.dir.y);
            // Carve passage from next to current (for backtracking)
            this.map[next.y][next.x].setDirection(-next.dir.x, -next.dir.y);
            this.visited[next.y][next.x] = true;
            this.stack.push({ x: next.x, y: next.y });
            this.setOrigin(next.x, next.y);
        } else {
            // Backtrack
            this.stack.pop();
            if (this.stack.length > 0) {
                let prev = this.stack[this.stack.length - 1];
                this.setOrigin(prev.x, prev.y);
            }
        }
    }
}

// create the maze
let maze = new Maze(mazeWidth, mazeHeight);
let view = new View();

view.drawMaze(maze, drawArrow, highlightOrigin, hideText);

// animation loop
function mainLoop() {
    maze.iterate();
    view.drawMaze(maze, drawArrow, highlightOrigin, hideText);
    if (animate) setTimeout(mainLoop, 1000 / animationFPS);
}

// event listeners
document.addEventListener("click", function(event) {
    if (maze.stack.length === 0) {
        maze = new Maze(mazeWidth, mazeHeight);
    } else {
        let start = Date.now();
        for (let i = 0; i < algorithmIterations; i++) {
            maze.iterate();
        }
        let end = Date.now();
        console.log(`Performed ${algorithmIterations} iterations. Execution time: ${end - start} milliseconds`);
    }
    view.drawMaze(maze, drawArrow, highlightOrigin, hideText);
});

document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case " ":
            // toggle animation
            animate = !animate;
            setTimeout(mainLoop, 1000 / animationFPS);
            break;
        case "a":
            // toggle arrows
            drawArrow = !drawArrow;
            view.drawMaze(maze, drawArrow, highlightOrigin, hideText);
            break;
        case "i":
            // one iteration
            maze.iterate();
            view.drawMaze(maze, drawArrow, highlightOrigin, hideText);
            break;
        case "o":
            // toggle highlight origin
            highlightOrigin = !highlightOrigin;
            console.log(highlightOrigin);
            view.drawMaze(maze, drawArrow, highlightOrigin, hideText);
            break;
        case "h":
            hideText = !hideText;
            view.drawMaze(maze, drawArrow, highlightOrigin, hideText);
            break;
        default:
            break;
    }
});

document.getElementById('apply').addEventListener('click', updateMazeDimensions);

function updateMazeDimensions() {
    // validate
    try {
        mazeWidth = parseInt(document.getElementById('width').value);
        mazeHeight = parseInt(document.getElementById('height').value);

        if (mazeWidth < 1 || mazeHeight < 1) throw new error("values can't be 0 or negative");
    } catch {
        mazeWidth = 10;
        mazeHeight = 10;
    }
    
    algorithmIterations = mazeWidth * mazeHeight * 10;
    maze = new Maze(mazeWidth, mazeHeight);
}

// helpers
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // min inclusive, max exclusive
}