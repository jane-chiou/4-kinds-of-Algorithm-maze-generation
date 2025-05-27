// View class handles all canvas drawing for the maze visualization
class View {
    constructor() {
        // Get the canvas element by its ID
        this.cnv = document.getElementById('canvas');
        // Get the 2D drawing context for the canvas
        this.ctx = this.cnv.getContext('2d');
        // Set the canvas width in pixels
        this.cnv.width = 1280;
        // Set the canvas height in pixels
        this.cnv.height = 720;
        // Boolean flag to control whether to show instruction text
        this.hideText = false;
    }

    // Fill the entire canvas with a dark background color
    drawBackground() {
        this.ctx.fillStyle = "rgb(50, 50, 50)"; // Set fill color to dark gray
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height); // Fill the whole canvas
    }

    // Draw instruction text on the canvas, unless hidden
    drawText() {
        if (this.hideText) return; // If hideText is true, skip drawing text
        this.ctx.fillStyle = "rgb(150, 150, 150)"; // Set text color to light gray
        this.ctx.font = "17px helvetica"; // Set font style and size
        this.ctx.fillText('Click the canvas to generate a new maze', 10, 30); // Draw first instruction
        this.ctx.fillText('Press "h" to hide/show this text', 10, 55); // Draw second instruction
    }

    /**
     * Draw the maze on the canvas.
     * @param {number[][]} maze - 2D array representing the maze; each cell uses bit flags for walls.
     * @param {boolean} hideText - Whether to hide the instruction text.
     * @param {number} marginY - Vertical margin for centering the maze.
     */
    drawMaze(maze, hideText = false, marginY = 50) {
        let height = maze.length; // Number of rows in the maze
        let width = maze[0].length; // Number of columns in the maze

        // Calculate the size of each cell based on canvas height and vertical margin
        let size = Math.floor((this.cnv.height - marginY * 2) / height);
        // Calculate horizontal margin to center the maze
        let marginX = Math.round((this.cnv.width - size * width) / 2);

        // If the maze is wider than it is tall, adjust margins and cell size for best fit
        if (width / height > this.cnv.width / this.cnv.height) {
            marginX = marginY; // Set horizontal margin equal to vertical margin
            size = Math.floor((this.cnv.width - marginX * 2) / width); // Recalculate cell size
            marginY = Math.round((this.cnv.height - size * height) / 2); // Recalculate vertical margin
        }

        this.drawBackground(); // Fill the background
        if (!hideText) this.drawText(); // Draw instructions if not hidden

        this.ctx.strokeStyle = "rgb(0,200,255)"; // Set wall color (cyan)
        this.ctx.lineWidth = 2; // Set wall thickness

        // Draw the outer border of the maze
        this.ctx.beginPath(); // Start a new path for the border
        this.ctx.moveTo(marginX, marginY); // Top-left corner
        this.ctx.lineTo(marginX + width * size, marginY); // Top-right corner
        this.ctx.lineTo(marginX + width * size, marginY + height * size); // Bottom-right corner
        this.ctx.lineTo(marginX, marginY + height * size); // Bottom-left corner
        this.ctx.lineTo(marginX, marginY); // Back to top-left corner
        this.ctx.stroke(); // Draw the border

        // Loop through each cell in the maze to draw walls
        for (let y = 0; y < height; y++) { // For each row
            for (let x = 0; x < width; x++) { // For each column
                let cell = maze[y][x]; // Get the bit flag value for this cell
                let x0 = marginX + x * size; // Calculate the top-left x coordinate of the cell
                let y0 = marginY + y * size; // Calculate the top-left y coordinate of the cell

                // Draw the right wall if the first bit is set (bitwise AND with 1)
                if (cell & 1) {
                    this.ctx.beginPath(); // Start a new path for the right wall
                    this.ctx.moveTo(x0 + size, y0); // Top-right corner of the cell
                    this.ctx.lineTo(x0 + size, y0 + size); // Bottom-right corner of the cell
                    this.ctx.stroke(); // Draw the right wall
                }
                // Draw the bottom wall if the second bit is set (bitwise AND with 2)
                if (cell & 2) {
                    this.ctx.beginPath(); // Start a new path for the bottom wall
                    this.ctx.moveTo(x0, y0 + size); // Bottom-left corner of the cell
                    this.ctx.lineTo(x0 + size, y0 + size); // Bottom-right corner of the cell
                    this.ctx.stroke(); // Draw the bottom wall
                }
            }
        }
    }
}