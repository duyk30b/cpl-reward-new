class Map {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.data = [
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//0
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//10
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"coinBox",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"brick",_,_,_,"floor","floor"], //20
            [_,_,_,_,_,_,_,_,_,"coinBox",_,_,_,"floor","floor"],
            [_,_,_,_,_,"coinBox",_,_,_,"brick",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"coinBox",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"brick",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,"pipeTopGreen",x,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,x,x,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//30
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,"pipeTopGreen","pipeConnectVerticalGreen",x,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,x,x,x,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//40
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"pipeTopGreen",x,"pipeConnectVerticalGreen",x,"floor","floor"],//40
            [_,_,_,_,_,_,_,_,_,x,x,x,x,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//50
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"pipeTopGreen",x,"pipeConnectVerticalGreen",x,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,x,x,x,x,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//60
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor",_,_,_,_,"up_life",_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],//70
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"brick",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"coinBox",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"brick",_,_,_,"floor","floor"],
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],//80
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//90
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"coinBox",_,_,_,"coinBox",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"brick",_,_,_,"floor","floor"],//100
            [_,_,_,_,_,_,_,_,_,"brick",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"coinBox",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"coinBox",_,_,_,"coinBox",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//110
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"coinBox",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"brick",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//120
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,"coinBox",_,_,_,"brick",_,_,_,"floor","floor"],
            [_,_,_,_,_,"coinBox",_,_,_,"brick",_,_,_,"floor","floor"],//130
            [_,_,_,_,_,"brick",_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,"stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,"stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,"stone","stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,"stone","stone","stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"stone","stone","stone","stone","floor","floor"],//140
            [_,_,_,_,_,_,_,_,_,_,"stone","stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,"stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,"stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,"stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,"stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,"stone","stone","stone","floor","floor"],//150
            [_,_,_,_,_,_,_,_,_,"stone","stone","stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,"stone","stone","stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,"stone","stone","stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,"stone","stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,"stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,"stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//160
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,"pipeTopGreen",x,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,x,x,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"brick",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"brick",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,"coinBox",_,_,_,"floor","floor"],//170
            [_,_,_,_,_,_,_,_,_,"brick",_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,"pipeTopGreen",x,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,x,x,"floor","floor"],//180
            [_,_,_,_,_,_,_,_,_,_,_,_,"stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,"stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,"stone","stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,"stone","stone","stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,"stone","stone","stone","stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,"stone","stone","stone","stone","stone","stone","floor","floor"],
            [_,_,_,_,_,_,"stone","stone","stone","stone","stone","stone","stone","floor","floor"],//180
            [_,_,_,_,_,"stone","stone","stone","stone","stone","stone","stone","stone","floor","floor"],
            [_,_,_,_,_,"stone","stone","stone","stone","stone","stone","stone","stone","floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//190
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,"flag",_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,"flagPole",x,x,x,x,x,x,x,x,x,x,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//200
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,"smallCastle",x,x,x,x,"floor","floor"],
            [_,_,_,_,_,_,_,_,x,x,x,x,x,"floor","floor"],
            [_,_,_,_,_,_,_,_,x,x,x,x,x,"floor","floor"],
            [_,_,_,_,_,_,_,_,x,x,x,x,x,"floor","floor"],
            [_,_,_,_,_,_,_,_,x,x,x,x,x,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//210
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,"floor","floor"],//212
        ];
        this.item = {
            bigHill: {img: "natural", postX: 3, postY: 0, w: 5, h: 2.5},
            smallHill: {img: "natural", postX: 4, postY: 2.5, w: 3, h: 1.5},
            singleBush: {img: "natural", postX: 2, postY: 4, w: 2, h: 1},
            doubleBush: {img: "natural", postX: 0, postY: 0, w: 3, h: 1},
            tripleBush: {img: "natural", postX: 4, postY: 4, w: 4, h: 1},
            singleCloud: {img: "natural", postX: 0, postY: 4, w: 2, h: 1.5},
            doubleCloud: {img: "natural", postX: 0, postY: 1, w: 3, h: 1.5},
            tripleCloud: {img: "natural", postX: 0, postY: 2.5, w: 4, h: 1.5},
            floor: {img: "item", postX: 1, postY: 1, w: 1, h: 1},
            brick: {img: "item", postX: 1, postY: 3, w: 1, h: 1},
            coinBox: {img: "item", postX: 1, postY: 7, w: 1, h: 1},
            stone: {img: "item", postX: 2, postY: 9.5, w: 1, h: 1},
            pipeTopGreen: {img: "pipeGreen", postX: 2, postY: 4, w: 2, h: 2},
            pipeConnectVerticalGreen: {img: "pipeGreen", postX: 4, postY: 0, w: 2, h: 2},
            flagPole: {img: "item", postX: 2.0, postY: -0.5, w: 1, h: 11},
            flag: {img: "item", postX: 0.6, postY: 0, w: 1.4, h: 1},
            smallCastle: {img: "smallCastle", postX: 0, postY: 0, w: 5, h: 5},
        }
    }
    drawItem(i,dx,dy){
        this.game.ctx.drawImage(this.game.Images[this.item[i].img],
            this.item[i].postX * DOT_IMAGE_WIDTH,
            this.item[i].postY * DOT_IMAGE_HEIGHT,
            this.item[i].w * DOT_IMAGE_WIDTH,
            this.item[i].h * DOT_IMAGE_HEIGHT,
            dx * DOT_SIZE_WIDTH,
            dy * DOT_SIZE_HEIGHT,
            this.item[i].w * DOT_SIZE_WIDTH,
            this.item[i].h * DOT_SIZE_HEIGHT,);
    }
    drawNatural(i){
        switch (i%48) {
            case 0: this.drawItem("bigHill",i+this.x,10.5);break;
            case 11: this.drawItem("tripleBush",(i+0.5)+this.x,12);break;
            case 16: this.drawItem("smallHill",i+this.x,11.5);break;
            case 23: this.drawItem("singleBush",(i+0.5)+this.x,12);break;
            case 41:  this.drawItem("doubleBush",(i+0.5)+this.x,12);break;
            case 8:  this.drawItem("singleCloud",(i+0.5)+this.x,3);break;
            case 19: this.drawItem("singleCloud",(i+0.5)+this.x,2);break;
            case 27: this.drawItem("tripleCloud",(i+0.5)+this.x,3);break;
            case 36: this.drawItem("doubleCloud",(i+0.5)+this.x,2);break;
        }
    }
    drawMap(){
        for(let i = 0; i < 212; i ++){
            if(i+this.x < -4 || i+this.x >25) continue;
            this.drawNatural(i);
            for(let j = 0; j < 15; j++){
                if (this.data[i][j]==null||this.data[i][j]===x) continue;
                this.drawItem(this.data[i][j],i+this.x,j);
            }

        }
    }

}