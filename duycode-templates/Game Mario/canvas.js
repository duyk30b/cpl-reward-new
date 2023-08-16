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
}