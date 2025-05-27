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
        // 這些行是繪製文字的，將它們註解掉或刪除即可移除文字
        /*
        this.ctx.fillStyle = "rgb(150, 150, 150)";
        this.ctx.font = "17px helvetica";
        this.ctx.fillText('Space bar to toggle animation', 10, 40);
        this.ctx.fillText('"i" key to iterate once', 10, 60);
        this.ctx.fillText('"o" key to toggle highlight origin', 10, 80);
        this.ctx.fillText('"h" key to hide text', 10, 100);
        */
    }

    drawMaze(maze, highlightOrigin = true, hideText = false, marginY = 50) {
        //繪製和文字
        this.drawBackground();
        if (!hideText) this.drawText(); // 這裡會呼叫 drawText()，但因為 drawText() 內部已清空，所以不會繪製文字

        //計算節點大小和位置
        let size = (this.cnv.height - marginY * 2) / maze.height;
        let marginX = Math.round((this.cnv.width - size * maze.width) / 2);
        size = Math.round(size);

        //寬高比檢查
        if (maze.width / maze.height > this.cnv.width / this.cnv.height) {
            marginX = marginY;
            size = (this.cnv.width - marginX * 2) / maze.width;
            marginY = Math.round((this.cnv.height - size * maze.height) / 2);
            size = Math.round(size);
            console.log('調整畫布長寬比');
        }

        // 繪製單元格和牆壁 (藍色為牆壁，白色為通路)
        for (let y = 0; y < maze.height; y++) {
            for (let x = 0; x < maze.width; x++) {
                const xPos = x * size + marginX;
                const yPos = y * size + marginY;
                
                // 绘制单元格背景
                this.ctx.fillStyle = maze.map[y][x] === 1 ? "rgb(0, 100, 200)" : "rgb(255, 255, 255)";
                this.ctx.fillRect(xPos, yPos, size, size);
            }
        }
        
        // colour origin point (Red)
        if(highlightOrigin && maze.origin){
            this.ctx.fillStyle = "rgb(255, 0, 0)"; // 紅色
            let xPos = maze.origin.x * size + marginX ;
            let yPos = maze.origin.y * size + marginY ;
                
            this.ctx.beginPath();
            this.ctx.fillRect(xPos, yPos, size, size);
            this.ctx.fill();
        }

        // colour destination point (Green)
        if(maze.destination){ // 檢查終點是否存在
            this.ctx.fillStyle = "rgb(0, 255, 0)"; // 綠色
            let xPos = maze.destination.x * size + marginX ;
            let yPos = maze.destination.y * size + marginY ;
                
            this.ctx.beginPath();
            this.ctx.fillRect(xPos, yPos, size, size);
            this.ctx.fill();
        }
    }
}