// This code controls the graphics content of the algorithm

class View {
    constructor() {
        /** @type {HTMLCanvasElement} */
        this.cnv = document.getElementById('canvas');
        this.ctx = this.cnv.getContext('2d');
        this.cnv.width = 1280;
        this.cnv.height = 720;
    }

    drawBackground() {
        this.ctx.fillStyle = "rgb(50, 50, 50)";
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
    }

    drawText() {
        this.ctx.fillStyle = "rgb(150, 150, 150)";
        this.ctx.font = "17px helvetica";
        this.ctx.fillText('Right click to generate maze', 10, 20);
        this.ctx.fillText('Space bar to toggle animation', 10, 40);
        this.ctx.fillText('"i" key to iterate once', 10, 60);
        this.ctx.fillText('"o" key to toggle highlight origin', 10, 100);
        this.ctx.fillText('"h" key to hide text', 10, 140);
    }

    drawMaze(maze, highlightOrigin = true, hideText = false, marginY = 50) {
        //繪製和文字
        this.drawBackground();
        if (!hideText) this.drawText();

        console.log("Canvas context:", this.ctx);
        if (!this.ctx) {
            console.error("Canvas context is not defined!");
            return;
        }

        //計算節點大小和位置
        let size = (this.cnv.height - marginY * 2) / maze.height;
        let marginX = Math.round((this.cnv.width - size * maze.width) / 2);
        size = Math.round(size);
        let lineWidth = Math.ceil(size / 15);//計算線條寬度
        let nodeRadius = lineWidth * 1.5;//計算圓形半徑

        //寬高比檢查
        if (mazeWidth/mazeHeight > this.cnv.width/this.cnv.height) {
            marginX = marginY;
            size = (this.cnv.width - marginX * 2) / maze.width;
            marginY = Math.round((this.cnv.height - size * maze.height) / 2);
            size = Math.round(size);
            console.log('調整畫布長寬比');
        }
        //console.log(`Node size: ${size}, MarginX: ${marginX}, MarginY: ${marginY}`);

        //繪製迷宮節點
        //console.log("Maze map:", maze.map);
        this.ctx.fillStyle = "rgb(0, 200, 255)";
        for (let y = 0; y < maze.height; y++) {
            for (let x = 0; x < maze.width; x++) {
                //console.log(`Value at (${x}, ${y}): ${maze.map[y][x]}`);
                if(maze.map[y][x] === 1){
                    this.ctx.fillStyle = "rgb(0, 200, 255)";
                }
                else{
                    this.ctx.fillStyle = "rgb(255, 255, 255)";
                }
                    let xPos = x * size + marginX + size / 2;
                    let yPos = y * size + marginY + size / 2;
                    //console.log(`Drawing node at (${xPos}, ${yPos})`);
                    // draw node
                    this.ctx.beginPath();
                    this.ctx.arc(xPos, yPos, nodeRadius, 0, 2*Math.PI);
                    this.ctx.fill();
                
            }
        }

        //if (!highlightOrigin) return;

        // colour origin point
        if(highlightOrigin && maze.origin){
            this.ctx.fillStyle = "rgb(255, 0, 0)";
            let xPos = maze.origin.x * size + marginX + size / 2;
            let yPos = maze.origin.y * size + marginY + size / 2;
            this.ctx.beginPath();
            this.ctx.arc(xPos, yPos, nodeRadius, 0, 2*Math.PI);
            this.ctx.fill();
        }
        
    }
}