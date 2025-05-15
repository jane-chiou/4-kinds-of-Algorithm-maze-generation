// global variables (feel free to edit these values)
let mazeWidth = 10;
let mazeHeight = 10;
let algorithmIterations = mazeWidth * mazeHeight * 10; // how many iterations should be performed when running the algorithm
let animationFPS = 3; // frames per second
let drawArrow = false; // whether to show the direction of each node or not. Toggle with "a" key
let highlightOrigin = true; // wether to highlight the origin node or not. Toggle with "o" key
let hideText = false; // Toggle with "h" keyg
let animate = false; //  whether to animate the algorithm or not. Toggle with space bar

//表示迷宮中的節點，每個節點包含一個方向屬性（direction）用來設置該節點的箭頭方向
// 這個方向屬性是一個物件，包含x和y兩個屬性，分別表示水平方向和垂直方向的值
// 節點的方向可以通過setDirection方法來設置，這個方法接受兩個參數x和y，分別表示水平方向和垂直方向的值
// 節點的方向可以是-1、0或1，分別表示向左、向下或向右移動
// 節點的方向預設為(0, 0)，表示不移動
// 節點的方向可以用來繪製迷宮的箭頭，這些箭頭指向節點的移動方向
/*class Node {
    constructor(directionX = 0, directionY = 0) {
        this.direction = {x: directionX, y: directionY};
    }

    setDirection(x, y) {
        this.direction.x = x;
        this.direction.y = y;
    }
}*/

// 這個類別用來繪製迷宮的視圖，包含一個canvas元素和一個2D繪圖上下文
// 它有一個drawMaze方法，用來繪製迷宮，這個方法接受一個迷宮物件和一些選項參數
// drawMaze方法會計算迷宮的大小和位置，然後用canvas的2D繪圖上下文來繪製迷宮
class Maze {
    //  初始化迷宮的高度寬度，生成nodes的map
    constructor(width, height) {
        this.width = width;
        this.height = height;
        console.log(`Maze dimensions: ${width}x${height}`);
        this.map = this.newMap(); // the array of nodes defining the maze
        //this.origin = {x: this.width - 1, y: this.height - 1}; // position of the origin point
        //座標值往右、下是+1
        //this.nextOrigin = {x: null, y: null}; // position of the next origin point. this is defined here to improve performance
        /*this.possibleDirections = [
            {x: -1, y: 0},
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 1}
        ]; */
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
        let startX = getRandomInt(0, this.width);
        let startY = getRandomInt(0, this.height);
        this.origin = { x: startX, y: startY }; // 在 initialize 方法中設置
        this.map[startY][startX] = 0; //0 表示通路
        this.visited.push({ x: startX, y: startY });
        this.addWalls(startX, startY);
        console.log("Maze initialized:", this.map);
        console.log("Origin set to:", this.origin);
    }

    // 將節點的鄰居加入邊界清單
    addWalls(x, y) {
        console.log(`Adding walls around (${x}, ${y})`);
        const directions = [
            { x: -1, y: 0 },//左
            { x: 1, y: 0 },//右
            { x: 0, y: -1 },//上
            { x: 0, y: 1 }//下
        ];
        for (let dir of directions) {
            let nx = x + dir.x;// 計算新位置的 x 坐標
            let ny = y + dir.y;// 計算新位置的 y 坐標
            //確認nx和ny是不是在迷宮的寬度和高度範圍內
            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height && this.map[ny][nx] === 1) {
                //如果nx和ny在範圍內，並且這個位置是牆壁，將這個牆壁加入邊界清單
                this.walls.push({ x: nx, y: ny, px: x, py: y }); 
            }
            console.log(`Wall added: (${nx}, ${ny}) with parent (${x}, ${y})`);
        }
    }

    //執行一次 Prim's Algorithm 的迭代
    iterate() {
        console.log("Iterating...");
        if (this.walls.length === 0){
            //this.initialize(); // 如果邊界清單為空，重新初始化迷宮
            return; // 如果邊界清單為空，結束
        }

        // 隨機選擇一條牆
        let randomIndex = getRandomInt(0, this.walls.length);
        let wall = this.walls.splice(randomIndex, 1)[0];

        let { x, y, px, py } = wall;

        // 如果牆的另一側節點未訪問，將其設為通路
        if (this.map[y][x] === 1) {
            this.map[y][x] = 0; // 設為通路
            this.map[py][px] = 0; // 連接父節點
            this.addWalls(x, y); // 將新節點的鄰居加入邊界清單
        }

        console.log("Maze map updated:", this.map);
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
    for (let i = 0; i < algorithmIterations; i++) {
        maze.iterate();
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

// 更新迷宮尺寸
/*document.getElementById('apply').addEventListener('click', updateMazeDimensions);

function updateMazeDimensions() {
    console.log('updateMazeDimensions called');
    // validate
    try {
        mazeWidth = parseInt(document.getElementById('width').value);
        mazeHeight = parseInt(document.getElementById('height').value);

        if (mazeWidth < 1 || mazeHeight < 1) throw new Error("values can't be 0 or negative");
    } catch {
        mazeWidth = 10;
        mazeHeight = 10;
    }
    
    console.log(`New dimensions: ${mazeWidth}x${mazeHeight}`);
    algorithmIterations = mazeWidth * mazeHeight * 10;
    maze = new Maze(mazeWidth, mazeHeight);
    maze.initialize(); // 確保初始化
    console.log("Maze initialized:", maze.map);
}*/


// helpers
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // min inclusive, max exclusive
}