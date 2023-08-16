class Board {
    constructor(game) {
        this.game = game;
        this.data = [
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_]
        ];

    }

    isOnBoard(row,col){
        return (row >= 0 & row < 24 & col >= 0 & col < 10);
    }
    isEmptyDot(row,col){
        if(this.isOnBoard(row,col)) return this.data[row][col] === _;
        return false;
    }
    isBrickDot(row,col){
        return this.isOnBoard(row,col)&&(!this.isEmptyDot(row,col));
    }

    isFullRow(row){
        for(let i = 0; i < NUM_COLS; i++){
            if(this.data[row][i]===_){
                return false;
            }
        }
        return true;
    }
    removeOneRow(removeRow){
        for(let row = removeRow; row >= 4; row--){
            for (let col = 0; col < NUM_COLS; col++){
                this.data[row][col] = this.data[row-1][col];
            }
        }
    }

    updateWall(){
        let fullRow = [];
        for(let row = 4; row < NUM_ROWS; row++){
            if (this.isFullRow(row)){
                fullRow.push(row);
            }
        }
        for(let pos = 0; pos < fullRow.length; pos++){
            this.removeOneRow(fullRow[pos]);
        }
        this.game.score.updateScore(fullRow.length)
    }

    draw(){
        let listDots = [];
        for (let row = 4; row < NUM_ROWS; row++){
            for (let col = 0; col < NUM_COLS; col++){
                let newDot = new Dot(this.game,row,col,this.data[row][col]);
                listDots.push(newDot);
            }
        }
        listDots.forEach((d)=>d.draw());
    }
}