// global variables (feel free to edit these values)
let mazeWidth = 31; // 建議使用奇數，這樣牆壁和通路能更好地對齊
let mazeHeight = 31; // 建議使用奇數
let animationFPS = 10; // frames per second (調高一點讓動畫更快)
let drawArrow = false; // whether to show the direction of each node or not. Toggle with "a" key
let highlightOrigin = true; // wether to highlight the origin node or not. Toggle with "o" key
let highlightDestination = true; // New: whether to highlight the destination node or not.
let hideText = false; // Toggle with "h" key
let animate = false; //  whether to animate the algorithm or not. Toggle with space bar

// 控制 Binary Tree 演算法的動畫進度
let binaryTreeSteps = []; // 儲存所有需要打通的牆壁的坐標
let currentStepIndex = 0; // 當前動畫執行到的步驟索引

console.log("main1.js is running!"); // 檢查腳本是否載入執行

class Maze {
    constructor(width, height) {
        this.width = width % 2 === 0 ? width + 1 : Math.max(width, 3);
        this.height = height % 2 === 0 ? height + 1 : Math.max(height, 3);

        console.log(`Maze dimensions: ${this.width}x${this.height}`);
        this.map = this.newMap(); // the array of nodes defining the maze
        this.origin = null; // 迷宮的起點 (紅點)
        this.destination = null; // 迷宮的終點 (綠點)
    }

    // 初始化迷宮地圖為牆壁
    newMap() {
        let map = [];
        for (let y = 0; y < this.height; y++) {
            map.push([]);
            for (let x = 0; x < this.width; x++) {
                map[y].push(1); // 數字1表示牆壁
            }
        }
        return map;
    }

    // 隨機選擇邊緣的通路單元格坐標
    getRandomEdgeCell() {
        let x, y;
        const side = getRandomInt(0, 4); // 0: Top, 1: Right, 2: Bottom, 3: Left

        switch(side) {
            case 0: // Top edge (x 必須是奇數, y 是 0)
                x = getRandomInt(1, Math.floor((this.width - 1) / 2)) * 2 + 1; // 確保是奇數
                y = 0; // 最頂部
                break;
            case 1: // Right edge (x 是 width-1, y 必須是奇數)
                x = this.width - 1; // 最右邊
                y = getRandomInt(1, Math.floor((this.height - 1) / 2)) * 2 + 1; // 確保是奇數
                break;
            case 2: // Bottom edge (x 必須是奇數, y 是 height-1)
                x = getRandomInt(1, Math.floor((this.width - 1) / 2)) * 2 + 1; // 確保是奇數
                y = this.height - 1; // 最底部
                break;
            case 3: // Left edge (x 是 0, y 必須是奇數)
                x = 0; // 最左邊
                y = getRandomInt(1, Math.floor((this.height - 1) / 2)) * 2 + 1; // 確保是奇數
                break;
        }
        return { x, y };
    }

    // 初始化迷宮（設定起點和終點，並確保其為通路）
    initialize(){
        console.log("Initializing maze...");
        this.map = this.newMap(); // 每次初始化都重建地圖

        // 隨機選擇起點
        this.origin = this.getRandomEdgeCell();
        this.map[this.origin.y][this.origin.x] = 0; // 將起點設為通路

        // 隨機選擇終點，確保不與起點重疊
        do {
            this.destination = this.getRandomEdgeCell();
        } while (this.destination.x === this.origin.x && this.destination.y === this.origin.y);
        
        this.map[this.destination.y][this.destination.x] = 0; // 將終點設為通路

        console.log("Maze initialized with origin:", this.origin, "and destination:", this.destination);
    }

    // 這個方法現在會「預計算」所有 Binary Tree 的打通步驟
    precomputeBinaryTreeSteps() {
        binaryTreeSteps = []; // 清空之前的步驟
        let tempMap = this.newMap(); // 使用臨時地圖來預計算，不影響當前顯示的迷宮

        // 將起點和終點預設為通路
        tempMap[this.origin.y][this.origin.x] = 0;
        tempMap[this.destination.y][this.destination.x] = 0;

        // 遍歷所有單元格 (x, y 都是奇數)
        for (let y = 1; y < this.height - 1; y += 2) {
            for (let x = 1; x < this.width - 1; x += 2) {
                // 將當前單元格設為通路 (除了起點和終點)
                if (!(x === this.origin.x && y === this.origin.y) && 
                    !(x === this.destination.x && y === this.destination.y)) {
                    // 不需要將單元格本身加入 steps，因為它們總會變成通路
                    // tempMap[y][x] = 0; // 預設為通路
                }

                let directions = [];
                // 優先選擇向北或向西打通牆壁
                if (y - 1 >= 0 && (y - 2 >= 1)) { // 北方的牆壁, 並且上面還有一個單元格
                    directions.push({ dx: 0, dy: -1 }); 
                }
                if (x - 1 >= 0 && (x - 2 >= 1)) { // 西方的牆壁, 並且左邊還有一個單元格
                    directions.push({ dx: -1, dy: 0 }); 
                }

                if (directions.length > 0) {
                    let dir = directions[getRandomInt(0, directions.length)]; // 隨機選擇北或西
                    binaryTreeSteps.push({ cellX: x, cellY: y, wallX: x + dir.dx, wallY: y + dir.dy });
                }
            }
        }
        // 隨機打亂步驟，讓動畫看起來更隨機，而不是固定的從左上到右下
        shuffleArray(binaryTreeSteps);
        console.log("Binary Tree steps precomputed:", binaryTreeSteps.length);
    }

    // 這個方法現在會執行 Binary Tree 的一個單一步驟
    iterate() {
        if (currentStepIndex >= binaryTreeSteps.length) {
            console.log("Binary Tree animation complete.");
            return false; // 沒有更多步驟了
        }

        const step = binaryTreeSteps[currentStepIndex];
        
        // 打通單元格和牆壁
        this.map[step.cellY][step.cellX] = 0; // 將單元格設為通路
        this.map[step.wallY][step.wallX] = 0; // 將牆壁設為通路
        
        currentStepIndex++;
        return true; // 還有步驟可以執行
    }
}

// 建立迷宮物件（Maze）和繪圖物件（View）
let maze = new Maze(mazeWidth, mazeHeight);
maze.initialize(); // 初始化迷宮（起點、終點）
maze.precomputeBinaryTreeSteps(); // 預計算所有步驟
// 初始時將起點和終點設為通路
maze.map[maze.origin.y][maze.origin.x] = 0;
maze.map[maze.destination.y][maze.destination.x] = 0;

let view = new View();

view.drawMaze(maze, highlightOrigin, hideText);

// 每次迭代執行一次演算法 (如果動畫啟用)
function mainLoop() {
    console.log("animating...");
    if (animate && maze.iterate()) { // 執行一步，如果還有步驟就繼續
        view.drawMaze(maze, highlightOrigin, hideText);
        setTimeout(mainLoop, 1000 / animationFPS);
    } else {
        console.log("Animation stopped or maze generation complete.");
        animate = false; // 迷宮生成完成，停止動畫
    }
}

// event listeners
document.addEventListener("click", function(event) {
    // 檢查點擊事件是否來自 input 或 button，如果是，則不做任何事
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') {
        return;
    }

    let start = Date.now();
    
    // 點擊非控制元素時，重新生成迷宮
    maze = new Maze(mazeWidth, mazeHeight);
    maze.initialize(); // 初始化起點終點
    maze.precomputeBinaryTreeSteps(); // 重新預計算所有步驟
    currentStepIndex = 0; // 重置動畫進度
    animate = false; // 停止可能的動畫

    // 立即顯示完整的迷宮 (可以選擇不顯示，只靠動畫)
    // 為了立即看到完整迷宮，可以把所有步驟立即執行
    while (maze.iterate()) {} 
    view.drawMaze(maze, highlightOrigin, hideText);
    
    let end = Date.now();
    console.log(`Maze regenerated. Execution time: ${end - start} milliseconds`);
});

// 新增 'apply' 按鈕的事件監聽器
document.addEventListener("DOMContentLoaded", function() {
    const applyButton = document.getElementById('apply');
    if (applyButton) {
        applyButton.addEventListener('click', function() {
            const widthInput = document.getElementById('width');
            const heightInput = document.getElementById('height');

            const newWidth = parseInt(widthInput.value);
            const newHeight = parseInt(heightInput.value);

            if (!isNaN(newWidth) && newWidth > 0 && !isNaN(newHeight) && newHeight > 0) {
                mazeWidth = newWidth % 2 === 0 ? newWidth + 1 : Math.max(newWidth, 3);
                mazeHeight = newHeight % 2 === 0 ? newHeight + 1 : Math.max(newHeight, 3);
                
                maze = new Maze(mazeWidth, mazeHeight);
                maze.initialize(); // 初始化起點終點
                maze.precomputeBinaryTreeSteps(); // 重新預計算所有步驟
                currentStepIndex = 0; // 重置動畫進度
                animate = false; // 停止可能的動畫

                // 立即顯示完整的迷宮
                while (maze.iterate()) {}
                view.drawMaze(maze, highlightOrigin, hideText);
                
                console.log(`Maze dimensions updated to: ${mazeWidth}x${mazeHeight}`);
            } else {
                console.warn("Invalid maze dimensions. Please enter positive numbers.");
            }
        });
    } else {
        console.error("Button with ID 'apply' not found.");
    }
});


document.addEventListener("keydown", function(event) {
    console.log(`Key pressed: ${event.key}`); // 調試訊息
    // 只有當焦點不在 input 元素時才執行鍵盤事件
    if (event.target.tagName === 'INPUT') {
        return;
    }
    
    event.preventDefault(); // 阻止預設行為 (例如空白鍵滾動)
    switch (event.key) {
        case " ":
            // toggle animation
            animate = !animate;
            if(animate) mainLoop();
            break;
        case "i":
            // "i" key to perform one step of animation
            if (maze.iterate()) { // 執行一步，如果有變化就繪製
                view.drawMaze(maze, highlightOrigin, hideText);
            } else {
                console.log("Maze generation complete (single step mode).");
            }
            break;
        case "o":
            // toggle highlight origin
            highlightOrigin = !highlightOrigin;
            console.log("Highlight origin:", highlightOrigin);
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


// helpers
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // min inclusive, max exclusive
}

// 隨機打亂陣列的函式 (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}