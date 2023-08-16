class Controller {
    constructor() {
    }

    static delayControl(normalControl,delayControl,keyup,beforeDelay,holdDelay,timeOne){
        let beforeControl = 0;
        let timeHold = 0;
        let timeGet = 0;
        let keys = {};
        let id = null;

        setInterval(()=>{
            beforeControl = beforeControl + 5;
            timeHold = timeHold + 5;
            timeGet = timeGet + 5;

            if(id in delayControl){
                if(beforeControl > beforeDelay){
                    delayControl[id]();
                    timeHold = 0;
                    timeGet = 0;
                }
                else if(timeHold > holdDelay){
                    {
                        if(timeGet>=timeOne){
                            delayControl[id]();
                            timeGet = 0;
                        }
                    }
                }
                beforeControl = 0;
            }
        },5);



        let checkTouchDevice = () => {
            return 'ontouchstart' in document;
        };

        if(checkTouchDevice()){
            document.addEventListener("touchstart", (event) => {
                let id = event.target.id;
                if(id in normalControl) normalControl[id]();
            });
            document.addEventListener("touchend", () => {
                id = null;
            });
        }
        else {
            document.addEventListener("mousedown", (event) => {
                let id = event.target.id;
                if(id in normalControl) normalControl[id]();
            });
            document.addEventListener("mouseup", () => {
                id = null;
            });


            document.addEventListener('keydown',(event)=>{
                let id = event.code;
                keys[event.code] = true;
                if(keys["KeyD"]) {
                    normalControl["KeyD"]();
                }
                if (keys["KeyW"]){
                    normalControl["KeyW"]();
                }
                if (keys["KeyA"]){
                    normalControl["KeyA"]();
                }

            },true);
            document.addEventListener('keyup',(event)=>{
                keys[event.code] = false;

                keyup(event.code);
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
//     },40,200,0);