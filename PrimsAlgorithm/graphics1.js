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
        //this.ctx.fillText('Right click to generate maze', 10, 20);
        this.ctx.fillText('Space bar to toggle animation', 10, 40);
        this.ctx.fillText('"i" key to iterate once', 10, 60);
        this.ctx.fillText('"o" key to toggle highlight origin', 10, 80);
        this.ctx.fillText('"h" key to hide text', 10, 100);
    }

    drawMaze(maze, highlightOrigin = true, hideText = false, marginY = 50) {
        //繪製和文字
        this.drawBackground();
        if (!hideText) this.drawText();

        /*console.log("Canvas context:", this.ctx);
        if (!this.ctx) {
            console.error("Canvas context is not defined!");
            return;
        }*/

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

        // 在drawMaze方法中改进绘制逻辑
        for (let y = 1; y < maze.height; y++) {
            for (let x = 1; x < maze.width; x++) {
                const xPos = x * size + marginX;
                const yPos = y * size + marginY;
                
                // 绘制单元格背景
                this.ctx.fillStyle = maze.map[y][x] === 1 ? "rgb(0, 100, 200)" : "rgb(255, 255, 255)";
                this.ctx.fillRect(xPos, yPos, size, size);
                
                // 绘制单元格边框
                this.ctx.strokeStyle = "rgb(50, 50, 50)";
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(xPos, yPos, size, size);
            }
        }

        // 先畫四個邊
        for (let y = 0; y < maze.height; y++) {
            this.ctx.fillStyle = "rgb(0, 100, 200)";
            let xPosLeft = 0 * size + marginX;
            let xPosRight = (maze.width - 1) * size + marginX;
            let yPos = y * size + marginY;
            this.ctx.fillRect(xPosLeft, yPos, size, size);
            this.ctx.fillRect(xPosRight, yPos, size, size);
        }
        for (let x = 0; x < maze.width; x++) {
            this.ctx.fillStyle = "rgb(0, 100, 200)";
            let xPos = x * size + marginX;
            let yPosTop = 0 * size + marginY;
            let yPosBottom = (maze.height - 1) * size + marginY;
            this.ctx.fillRect(xPos, yPosTop, size, size);
            this.ctx.fillRect(xPos, yPosBottom, size, size);
        }

        //if (!highlightOrigin) return;

        // colour origin point
        if(highlightOrigin && maze.origin){
            this.ctx.fillStyle = "rgb(255, 0, 0)";
            let xPos = maze.origin.x * size + marginX ;
            let yPos = maze.origin.y * size + marginY ;
                
            this.ctx.beginPath();
            //this.ctx.arc(xPos, yPos, nodeRadius, 0, 2*Math.PI);
            this.ctx.fillRect(xPos, yPos, size, size);
            this.ctx.fill();
        }
        
    }
}