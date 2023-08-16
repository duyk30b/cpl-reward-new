class Score {
    constructor(game) {
        this.game = game;
        this.myscore = 0;
        this.level = 1;
    }

    updateScore(x){
        this.level = this.updateLevel(this.game.basicspeed);
        switch (x) {
            case 1: this.myscore += 10 * this.scoreLevel(this.level); break;
            case 2: this.myscore += 30 * this.scoreLevel(this.level); break;
            case 3: this.myscore += 60 * this.scoreLevel(this.level); break;
            case 4: this.myscore += 100 * this.scoreLevel(this.level); break;
            default: return 0;
        }

    }

    updateLevel(speed){
        if(speed>=800) return 1;
        if(speed>=600) return 2;
        if(speed>=500) return 3;
        if(speed>=400) return 4;
        if(speed>=300) return 5;
        if(speed>=200) return 6;
        if(speed>=150) return 7;
        if(speed<=100) return 8;
        if(speed>=75) return 9;
        if(speed>=50) return 10;
        else return 10;
    }

    scoreLevel(level){
        switch (level) {
            case 1: return 1;
            case 2: return 1.2;
            case 3: return 1.5;
            case 4: return 1.8;
            case 5: return 2;
            case 6: return 2.5;
            case 7: return 3;
            case 8: return 3.5;
            case 9: return 4;
            case 10: return 5;
            default: return 1;
        }
    }

}