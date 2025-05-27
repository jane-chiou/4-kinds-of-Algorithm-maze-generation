// global variables 
let mazeWidth =22;
let mazeHeight = 22 ;
let algorithmIterations = mazeWidth * mazeHeight * 10; // how many iterations should be performed when running the algorithm
let animationFPS = 10; // frames per second
let drawArrow = false; // whether to show the direction of each node or not. Toggle with "a" key
let highlightOrigin = true; // wether to highlight the origin node or not. Toggle with "o" key
let hideText = false; // Toggle with "h" key
let animate = false; //  whether to animate the algorithm or not. Toggle with space bar
let iterateOrNot = true; // whether to iterate or not. Toggle with "i" key

class Maze {
    //  初始化迷宮的高度寬度，生成nodes的map
    constructor(width, height) {
        this.width = width;
        this.height = height;
        console.log(`Maze dimensions: ${width}x${height}`);
        this.map = this.newMap(); // the array of nodes defining the maze
        this.stack = []; // 用於DFS的堆疊
        this.visited = []; // 記錄已經遍歷過的節點
        this.origin = null; // 初始化 origin 為 null
    }

    //初始化迷宮地圖為牆壁
    newMap() {
        let map = [];
        for (let y = 0; y < this.height; y++) {
            map.push([]);
            for (let x = 0; x < this.width; x++) {
                map[y].push(1);//數字1表示牆壁
            }
        }
        console.log("New map created:", map);
        return map;
    }

    //隨機選擇起始地點
    initialize(){
        console.log("Initializing maze...");
        this.map = this.newMap(); // 每次初始化都重建地圖
        this.visited = [];
        this.stack = [];

        // 產生只會在邊界的 x, y
        let edgePositions = [0, this.width - 1];
        let startX = 0;
        let startY = 0;
        // 持續隨機直到不是四個角落
        while (true) {
            if (Math.random() < 0.5) {
                startX = edgePositions[Math.floor(Math.random() * 2)];
                startY = getRandomInt(0, this.height);
            } 
            else {
                startY = edgePositions[Math.floor(Math.random() * 2)];
                startX = getRandomInt(0, this.width);
            }
            // 如果不是四個角落就跳出
            if (!((startX === 0 || startX === this.width - 1) && (startY === 0 || startY === this.height - 1))) {
                break;
            }
        }

        this.origin = { x: startX, y: startY }; // 在 initialize 方法中設置
        this.map[startY][startX] = 0; //0 表示通路
        this.visited.push({ x: startX, y: startY });
        this.stack.push({ x: startX, y: startY });
        console.log("Maze initialized:", this.map);
        console.log("Origin set to:", this.origin);
    }

    // 取得未拜訪的鄰居（跳過一格，因為牆壁在中間）
    getUnvisitedNeighbors(x, y) {
    const directions = [
        { dx: -2, dy: 0 }, // left
        { dx: 2, dy: 0 },  // right
        { dx: 0, dy: -2 }, // up
        { dx: 0, dy: 2 }   // down
    ];
    let neighbors = [];
    for (let dir of directions) {
        let nx = x + dir.dx;
        let ny = y + dir.dy;
        // Only allow neighbors that are NOT on the outer edge
        if (
            nx > 0 && nx < this.width - 1 &&
            ny > 0 && ny < this.height - 1 &&
            this.map[ny][nx] === 1
            ) {
            neighbors.push({ nx, ny, dx: dir.dx, dy: dir.dy });
        }
    }
    return neighbors;
}

    // 執行一次 DFS 的迭代
    iterate() {
        if (this.stack.length === 0) {
            return false; // 沒有可走的路了
        }

        let current = this.stack[this.stack.length - 1];
        let { x, y } = current;

        let neighbors = this.getUnvisitedNeighbors(x, y);

        if (neighbors.length > 0) {
            // 隨機選一個未拜訪的鄰居
            let randIdx = getRandomInt(0, neighbors.length);
            let { nx, ny, dx, dy } = neighbors[randIdx];

            // 打通牆壁（中間那格）
            let wallX = x + dx / 2;
            let wallY = y + dy / 2;
            this.map[wallY][wallX] = 0;

            // 標記鄰居為通路並加入堆疊
            this.map[ny][nx] = 0;
            this.visited.push({ x: nx, y: ny });
            this.stack.push({ x: nx, y: ny });
        } else {
            // 沒有未拜訪鄰居就回退
            this.stack.pop();
        }
        return true;
    }
}

//建立迷宮物件（Maze）和繪圖物件（View）
let maze = new Maze(mazeWidth, mazeHeight);
maze.initialize(); // 初始化迷宮
let view = new View();
view.drawMaze(maze, highlightOrigin, hideText);

//每次迭代執行一次演算法
function mainLoop() {
    maze.iterate();
    view.drawMaze(maze, highlightOrigin, hideText);
    if (animate) setTimeout(mainLoop, 1000 / animationFPS);
}

document.addEventListener("click", function(event) {
    // If the maze is finished, reset it
    if (maze.stack.length === 0) {
        maze = new Maze(mazeWidth, mazeHeight);
        maze.initialize();
    }
    // Run enough iterations to generate the maze (or a chunk of it)
    for (let i = 0; i < algorithmIterations; i++) {
        if (!maze.iterate()) break; // Stop if finished
    }
    view.drawMaze(maze, highlightOrigin, hideText);
});

document.addEventListener("keydown", function(event) {
    event.preventDefault();
    switch (event.key) {
            case " ":
        animate = !animate;
        if (animate) {
            if (maze.stack.length === 0) {
                maze = new Maze(mazeWidth, mazeHeight);
                maze.initialize();
            }
            mainLoop();
        }
        break;
        case "i":
            // one iteration
            maze.iterate();
            view.drawMaze(maze, highlightOrigin, hideText);
            break;
        case "o":
            // toggle highlight origin
            highlightOrigin = !highlightOrigin;
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // min inclusive, max exclusive
}