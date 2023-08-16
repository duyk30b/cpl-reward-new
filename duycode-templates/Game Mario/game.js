class Game {
    constructor() {
        this.c = document.getElementById("myCanvas");
        this.c.style.width  = "100%";
        this.c.style.height = "100%";
        this.c.width  = DOT_SIZE_WIDTH * DOTS_ROW;
        this.c.height = DOT_SIZE_HEIGHT * DOTS_COLS;
        this.ctx = this.c.getContext("2d");

        this.init();

    }

    init(){
        this.dataReady = false;
        this.loadImg();
        this.loading = setInterval(()=>this.preloader(),20);
    }

    loadImg(){
        this.Images = {};
        let imgURLs = {};
        let count = 0;
        imgURLs["animal"] = 'img/animal.png';
        imgURLs["item"] = 'img/item.png';
        imgURLs["MarioBig"] = 'img/MarioBig.png';
        imgURLs["MarioSmall"] = 'img/MarioSmall.png';
        imgURLs["natural"] = 'img/natural.png';
        imgURLs["pipeGreen"] = 'img/pipeGreen.png';
        imgURLs["smallCastle"] = 'img/smallCastle.png';
        imgURLs["weapon"] = 'img/weapon.png';

        Object.keys(imgURLs).forEach((key) => {
            let image = new Image();
            image.onload = ()=>{
                count++;
                if(count===Object.keys(imgURLs).length){
                    this.dataReady = true;
                }
            };
            image.src = imgURLs[key];
            this.Images[key] = image;
        });
    }

    preloader(){
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText("Loading....", 400, 300);
        if(this.dataReady){
            clearInterval(this.loading);
            this.startGame();
        }
    }

    controller() {
        let keys = {};
        document.addEventListener('keydown',(event)=>{
            let id = event.code;
            keys[event.code] = true;

        },true);
        document.addEventListener('keyup',(event)=>{
            keys[event.code] = false;

        },true);

        setInterval(()=>{
            if(keys["KeyD"]) {
                this.mario.go(0.5,0);
            }
            if (keys["KeyA"]){
                this.mario.go(-0.5,0);
            }
            if (keys["KeyW"]){
                this.mario.jump();
            }
            if (keys["KeyS"]){
                this.mario.sit();
            }
        },50)

    }


    startGame(){
        this.mario = new Mario(this);
        this.map = new Map(this);
        this.controller();
        this.loops();

    }

    loops(){
        setInterval(()=>{
            this.draw();
        },20);
    }

    draw(){
        this.ctx.clearRect(0,0,DOT_SIZE_WIDTH*DOTS_ROW,DOT_SIZE_HEIGHT*DOTS_COLS);

        this.map.drawMap();
        this.mario.draw();
    }
}

let newGame = new Game();
