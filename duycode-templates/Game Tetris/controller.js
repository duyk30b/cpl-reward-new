class Controller {
    constructor() {
    }

    static delayControl(normalControl,delayControl,beforeDelay,timeDelay){
        let beforeControl = 0;
        let timeTouch = 0;
        let id = null;
        let loops;

        setInterval(()=>{
            beforeControl = beforeControl + 5;
            timeTouch = timeTouch + 5;

            if(id in delayControl){
                if(beforeControl > beforeDelay){
                    delayControl[id]();
                    timeTouch = 0;
                }
                else if(timeTouch > timeDelay){
                    delayControl[id]();
                }
                beforeControl = 0;
            }
            console.log(beforeControl);
        },5);



        let checkTouchDevice = () => {
            return 'ontouchstart' in document;
        };

        if(checkTouchDevice()){
            document.addEventListener("touchstart", (event) => {
                id = event.target.id;
                if(id in normalControl) normalControl[id]();
            });
            document.addEventListener("touchend", () => {
                id = null;
            });
        }
        else {
            document.addEventListener("mousedown", (event) => {
                id = event.target.id;
                if(id in normalControl) normalControl[id]();
            });
            document.addEventListener("mouseup", () => {
                id = null;
            });

            document.addEventListener('keydown',(event)=>{
                id = event.code;
                if(id in normalControl) normalControl[id]();
            },true);
            document.addEventListener('keyup',()=>{
                id = null;
            },true);
        }


    }
}

// Use:
// Controller.delayControl(
//     {
//         ArrowDown: () => this.brick.moveDown(),
//         ArrowUp: () => this.brick.rotate(),
//         Space: () => this.pauseGame(),
//         Enter: () => this.nextGame(),
//         "myCanvas": () => this.pauseGame(),
//         "moveDown": ()=> this.brick.moveDown(),
//         "Rotate": ()=> this.brick.rotate()
//     },
//     {
//         ArrowLeft: () => this.brick.moveLeft(),
//         ArrowRight: () => this.brick.moveRight(),
//         "moveLeft": ()=> this.brick.moveLeft(),
//         "moveRight": ()=> this.brick.moveRight()
//     },40,200);