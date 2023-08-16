class Canvas {
    constructor(game) {
        this.game = game;
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext('2d');
    }

    setWidthHeight(ws,hs,w,h){
        this.canvas.style.width  = ws;
        this.canvas.style.height = hs;
        this.canvas.width  = w;
        this.canvas.height = h;
    }

    // drawStar(cx, cy, spikes, outerRadius, innerRadius, fillColor, borderWidth, borderColor){
    //     let rot = Math.PI / 2 * 3;
    //     let x = cx;
    //     let y = cy;
    //     let step = Math.PI / spikes;
    //
    //     this.ctx.beginPath();
    //     this.ctx.moveTo(cx, cy - outerRadius);
    //     for (let i = 0; i < spikes; i++) {
    //         x = cx + Math.cos(rot) * outerRadius;
    //         y = cy + Math.sin(rot) * outerRadius;
    //         this.ctx.lineTo(x, y);
    //         rot += step;
    //
    //         x = cx + Math.cos(rot) * innerRadius;
    //         y = cy + Math.sin(rot) * innerRadius;
    //         this.ctx.lineTo(x, y);
    //         rot += step
    //     }
    //     this.ctx.lineTo(cx, cy - outerRadius);
    //     this.ctx.closePath();
    //     this.ctx.lineWidth = borderWidth;
    //     this.ctx.strokeStyle = borderColor;
    //     this.ctx.stroke();
    //     this.ctx.fillStyle = fillColor;
    //     this.ctx.fill();
    // }

    setFillStyle(color){
        switch (color) {
            case 1: this.ctx.fillStyle = BRICK_COLOR_ONE; break;
            case 2: this.ctx.fillStyle = BRICK_COLOR_TWO; break;
            case 3: this.ctx.fillStyle = BRICK_COLOR_THREE; break;
            case 4: this.ctx.fillStyle = BRICK_COLOR_FOUR; break;
            case 5: this.ctx.fillStyle = BRICK_COLOR_FIVE; break;
            case 6: this.ctx.fillStyle = BRICK_COLOR_SIX; break;
            case 7: this.ctx.fillStyle = BRICK_COLOR_SEVEN; break;
        }
    }

    drawNormalDot(x,y,color){
        switch (color) {
            case _ : this.ctx.fillStyle = BASIC_COLOR; break;
            case 0 : this.ctx.fillStyle = BRICK_COLOR_ZERO; break;
            default: this.setFillStyle(color%7+1); break;
        }
        this.ctx.fillRect(x+1,y+1,DOT_SIZE-2,DOT_SIZE-2);
    }

    drawHideDot(x,y){
        let random = Math.floor(this.game.timecount/100)%7 + 1;
        this.setFillStyle(random%7+1);
        this.ctx.fillRect(x+1,y+1,DOT_SIZE-2,DOT_SIZE-2);
    }

    drawSpreadBomb(x,y){
        this.ctx.beginPath();
        this.ctx.setLineDash([1, 1]);
        this.ctx.moveTo(x + DOT_SIZE/2 - 4, y + DOT_SIZE/2 - 4);
        this.ctx.lineTo(x + DOT_SIZE/2 + 4 , y + DOT_SIZE/2 + 4);
        this.ctx.moveTo(x + DOT_SIZE/2 - 4 , y + DOT_SIZE/2 + 4);
        this.ctx.lineTo(x + DOT_SIZE/2 + 4 , y + DOT_SIZE/2 - 4);
        this.ctx.strokeStyle = BRICK_COLOR_SPREADBOMB;
        this.ctx.stroke();
    }

    drawBomb(x,y){
        this.ctx.beginPath();
        this.ctx.arc(x+DOT_SIZE/2, y+DOT_SIZE/2, DOT_SIZE/2-1, 0, 2 * Math.PI, );
        this.ctx.fillStyle = BRICK_COLOR_ZERO;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(x+DOT_SIZE/2, y+DOT_SIZE/2, 4, 0, 2 * Math.PI, );
        if(this.game.timecount%600<300){
            this.ctx.fillStyle = BASIC_COLOR;
        }
        else {
            this.ctx.fillStyle = BRICK_COLOR_SEVEN;
        }
        this.ctx.fill();
    }
    drawShadow(x,y){
        this.drawNormalDot(x,y,_);
        this.ctx.beginPath();
        this.ctx.setLineDash([1, 1]);
        this.ctx.moveTo(x + 2, y + 2);
        this.ctx.lineTo(x + DOT_SIZE - 2 , y + 2);
        this.ctx.lineTo(x + DOT_SIZE - 2 , y + DOT_SIZE-2);
        this.ctx.lineTo(x + 2 , y + DOT_SIZE-2);
        this.ctx.lineTo(x + 2 , y + 2);

        this.ctx.moveTo(x + 5, y + 5);
        this.ctx.lineTo(x + DOT_SIZE - 5 , y + 5);
        this.ctx.lineTo(x + DOT_SIZE - 5 , y + DOT_SIZE-5);
        this.ctx.lineTo(x + 5 , y + DOT_SIZE-5);
        this.ctx.lineTo(x + 5 , y + 5);
        this.ctx.strokeStyle = BRICK_COLOR_ZERO;
        this.ctx.stroke();
    }

    drawGun(x,y){
        this.drawNormalDot(x,y,_);
        this.ctx.beginPath();
        this.ctx.moveTo(x + 2, y + 2);
        this.ctx.lineTo(x + DOT_SIZE - 2 , y + 2);
        this.ctx.lineTo(x + DOT_SIZE - 2 , y + DOT_SIZE/2);
        this.ctx.lineTo(x + DOT_SIZE/2 , y + DOT_SIZE-2);
        this.ctx.lineTo(x + 2 , y + DOT_SIZE/2);
        this.ctx.lineTo(x + 2 , y + 2);

        this.ctx.moveTo(x + 5, y + 5);
        this.ctx.lineTo(x + DOT_SIZE - 5 , y + 5);
        this.ctx.lineTo(x + DOT_SIZE - 5 , y + DOT_SIZE/2-1);
        this.ctx.lineTo(x + DOT_SIZE/2 , y + DOT_SIZE-6);
        this.ctx.lineTo(x + 5 , y + DOT_SIZE/2-1);
        this.ctx.lineTo(x + 5 , y + 5);
        this.ctx.stroke();
    }
}