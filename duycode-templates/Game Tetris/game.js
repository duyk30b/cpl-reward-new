class Game {
    constructor() {
        this.init();
    }

    init(){
        this.canvas = new Canvas(this);
        this.canvas.setWidthHeight(canvasWidth+'px','100%',canvasWidth,canvasHeight);
        this.newGame();
        this.controller();
    }

    newGame(){
        //create variable
        this.basicspeed = 1000;
        this.statusGame = 1;
        this.timecount = 0;

        //create the board, brick, dot
        this.board = new Board(this);
        this.nextBrick = new Brick(this);
        this.numberBrick = 0;
        this.createNewBrick();

        // start Game
        this.score = new Score(this);
        this.loop();
        this.startGame();

    }

    controller() {
        Controller.delayControl(
            {
                ArrowDown: () => this.brick.moveDown(),
                ArrowUp: () => this.brick.rotate(),
                Space: () => this.pauseGame(),
                Enter: () => this.nextGame(),
                "myCanvas": () => this.pauseGame(),
                "moveDown": ()=> this.brick.moveDown(),
                "Rotate": ()=> this.brick.rotate()
            },
            {
                ArrowLeft: () => this.brick.moveLeft(),
                ArrowRight: () => this.brick.moveRight(),
                "moveLeft": ()=> this.brick.moveLeft(),
                "moveRight": ()=> this.brick.moveRight()
            },40,200);
    }

    createNewBrick(){
        this.brick = this.nextBrick;
        this.nextBrick = new Brick(this);
        this.numberBrick++
    }

    startGame(){
        this.brick.fall();
        this.playGame = setTimeout(()=>this.startGame(),this.basicspeed);
    }

    loop(){
        this.draw();
        this.update();
        this.loops = setTimeout(()=>this.loop(),20);
    }

    update(){
        this.basicspeed = this.basicspeed * 0.99995;
        this.timecount = this.timecount + 20;
        let timePlay = String(Math.floor(this.timecount/60000)).padStart(2,'0')
            + " : " + String(Math.floor((this.timecount%60000)/1000)).padStart(2,'0');
        let numberBrick = String(this.numberBrick).padStart(3,'0');

        document.getElementById("score").innerHTML = this.score.myscore;
        document.getElementById("level").innerHTML = String(this.score.updateLevel(this.basicspeed));
        document.getElementById("speed").innerHTML = String(Math.round(100000/this.basicspeed));
        document.getElementById("numberBrick").innerHTML = numberBrick;
        document.getElementById("timeCount").innerHTML = timePlay;
    }

    draw(){
        this.board.draw();
        this.board.draw();
        this.brick.draw();
        this.nextBrick.preview();
    }

    stopGame(){
        clearTimeout(this.playGame);
        clearTimeout(this.loops);
    }

    pauseGame(){
        if(this.statusGame===1){
            this.statusGame = 0;
            clearTimeout(this.playGame);
            clearTimeout(this.loops);
        }
        else{
            this.startGame();
            this.loop();
            this.statusGame = 1;
        }
    }

    nextGame(){
        clearTimeout(this.playGame);
        clearTimeout(this.loops);
        this.newGame();
    }
}

let game = new Game();
let newGame = () => game.nextGame();

