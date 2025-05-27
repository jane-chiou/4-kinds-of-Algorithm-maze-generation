// global variables 
let mazeWidth = 30;
let mazeHeight = 30;
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
        // an array containing the possible directions the origin can travel in
        this.visited = [];//紀錄已經遍歷過的節點
        this.walls = [];//紀錄節點邊界的節點
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
            //map[y].push(new Node(0, 1));//最右邊的那排節點箭頭向下
        }
        console.log("New map created:", map);
        //map[this.height - 1][this.width - 1].setDirection(0, 0);//設最右下角的節點為原點

        return map;
    }

    //隨機選擇起始地點
    initialize(){
        console.log("Initializing maze...");
        this.map = this.newMap(); // 每次初始化都重建地圖
        this.visited = [];
        this.walls = [];

        // 產生只會在邊界的 x, y
        let edgePositions = [0, this.width - 1];
        let startX = 0;
        let startY = 0;
        // 持續隨機直到不是四個角落
        console.log('iterateOrNot:', iterateOrNot);
        while (true) {
            if (Math.random() < 0.5) {
                startX = edgePositions[Math.floor(Math.random() * 2)];
                startY = getRandomInt(0, this.height);
            } 
            else {
                startY = edgePositions[Math.floor(Math.random() * 2)];
                startX = getRandomInt(0, this.width);
            }
            console.log(`Random start position: (${startX}, ${startY})`);
            // 如果不是四個角落就跳出
            if (!((startX === 0 || startX === this.width - 1) && (startY === 0 || startY === this.height - 1))) {
                break;
            }
        }

        this.origin = { x: startX, y: startY }; // 在 initialize 方法中設置
        this.map[startY][startX] = 0; //0 表示通路
        this.visited.push({ x: startX, y: startY });
        this.addWalls(startX, startY);
        console.log("Maze initialized:", this.map);
        console.log("Origin set to:", this.origin);
    }

    // 將節點的鄰居加入邊界清單
    addWalls(startX, startY) {
        //console.log(`Adding walls around (${startX}, ${startY})`);
        const directions = [
            { dx: -1, dy: 0 },//左
            { dx: 1, dy: 0 },//右
            { dx: 0, dy: -1 },//上
            { dx: 0, dy: 1 }//下
        ];
        for (let dir of directions) {
            let nx = startX + dir.dx;// 計算新位置的 x 坐標
            let ny = startY + dir.dy;// 計算新位置的 y 坐標
            //確認nx和ny是不是在迷宮的寬度和高度範圍內
            // Only add walls that are NOT on the outer edge
            if (nx > 0 && nx < this.width - 1 &&ny > 0 && ny < this.height - 1 
                &&this.map[ny][nx] === 1) {
                this.walls.push({ x: nx, y: ny, px: startX, py: startY }); 
            }
            //console.log(`Wall added: (${nx}, ${ny}) with parent (${startX}, ${startY})`);
        }
    }

    //執行一次 Prim's Algorithm 的迭代
    iterate() {
        console.log("Iterating...");
        if (this.walls.length === 0){
            //this.initialize(); // 如果邊界清單為空，重新初始化迷宮
            return false; // 如果邊界清單為空，結束
        }

        // 隨機選擇一條牆
        let randomIndex = getRandomInt(0, this.walls.length);
        let wall = this.walls.splice(randomIndex, 1)[0];

        let { x, y, px, py } = wall;

        // 计算对面单元格
            const dx = x - px;
            const dy = y - py;
            const nx = x + dx;
            const ny = y + dy;

        // 检查对面单元格是否有效且未访问
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height && 
            this.map[ny][nx] === 1) {
            
            // 打通当前墙和对面单元格
            this.map[y][x] = 0;
            this.map[ny][nx] = 0;
            this.visited.push({x: x, y: y});
            
            // 添加新单元格的邻墙
            this.addWalls(nx, ny);
            
            return true; // 返回true表示有变化
        }
        
        iterateOrNot = false; // 如果没有变化，设置为false 
        return false; // 返回false表示无变化
    }
}

//建立迷宮物件（Maze）和繪圖物件（View）
let maze = new Maze(mazeWidth, mazeHeight);
maze.initialize(); // 初始化迷宮
let view = new View();
view.drawMaze(maze, highlightOrigin, hideText);

//每次迭代執行一次演算法
function mainLoop() {
    console.log("animating...");
    maze.iterate();
    view.drawMaze(maze, highlightOrigin, hideText);
    if (animate) setTimeout(mainLoop, 1000 / animationFPS);
    else console.log("animation stopped");
}

// event listeners
document.addEventListener("click", function(event) {
    let start = Date.now();
    if(iterateOrNot === true){
        for (let i = 0; i < algorithmIterations; i++) {
            maze.iterate();
        }
    }
    else{
        maze = new Maze(mazeWidth, mazeHeight);
        maze.initialize();
        view.drawMaze(maze, highlightOrigin, hideText);
        maze.iterate();
        iterateOrNot = true;
        console.log("Maze reinitialized");
    }
    let end = Date.now();
    console.log(`Performed ${algorithmIterations} iterations. Execution time: ${end - start} milliseconds`);

    view.drawMaze(maze, highlightOrigin, hideText);
});

document.addEventListener("keydown", function(event) {
    console.log(`Key pressed: ${event.key}`); // 調試訊息
    event.preventDefault();
    switch (event.key) {
        case " ":
            // toggle animation
            animate = !animate;
            if(animate) mainLoop();
            break;
        case "i":
            // one iteration
            maze.iterate();
            view.drawMaze(maze, highlightOrigin, hideText);
            break;
        case "o":
            // toggle highlight origin
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // min inclusive, max exclusive
}