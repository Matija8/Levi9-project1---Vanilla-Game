'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */


class Cell {
    constructor(row, col, item, game){
        this.row        = row;
        this.col        = col;
        this.item       = item; //DOM object reference.
        this.game       = game; //Game object.
        this.style      = game.style;
        this.mineState  = 'no-mine'; // {'no-mine', 'MINE!'} 
        this.clickState = 'not-clicked'; // {'not-clicked', 'left-clicked', 'right-clicked'}
        this.adjacent   = [];

        //Setting cell css properties.
        this.css = this.item.style;
        this.css.width = this.css.height = this.style.cellSize;
        this.css.fontSize = this.style.fontSize;
        this.css.backgroundImage = this.style.image_NotClicked;
        this.css.backgroundSize = 'contain';
        this.setListeners();
        this.item.addEventListener('contextmenu', event => { event.preventDefault(); }); // Deliberately removed from other listeners.
    }


    setListeners(){
        this.listenerFunctions = [];
        this.listenerFunctions.push([ 'mousedown',   event => { this.mouseDown(event); } ]);
        this.listenerFunctions.push([ 'mouseup',     event => { if(event.button === 1) this.midUp(); } ]);
        this.listenerFunctions.push([ 'mouseenter',  ()    => { this.mouseIn();  } ]);
        this.listenerFunctions.push([ 'mouseout',    ()    => { this.mouseOut(); } ]);
        //this.listenerFunctions.push([ 'contextmenu', event => { event.preventDefault(); } ]);
        this.listenerFunctions.forEach(pair => { this.item.addEventListener(...pair);});
    }


    removeListeners(){
        this.listenerFunctions.forEach(pair => {
            this.item.removeEventListener(...pair);
        });
    }


    mouseDown(event){
        switch(event.button){
            case 0:
                this.leftDown();  break;
            case 1:
                this.midDown();   break;
            case 2:
                this.rightDown(); break;
        }
    }


    leftDown(){
        if(this.game.midDownFlag || this.clickState !== 'not-clicked'){
            // You can only left click while:
            // 1) not highlighting
            // 2) if the cell is not alredy clicked
            return;
        }
        if(this.mineState === 'MINE!'){     // Mine hit.
            this.game.gameLoss(this);
            return;
        }
        if(this.game.firstClick){           // First click in the game. Still a normal left-click.
            this.game.firstClick = false;
            this.game.setRandomMines(this);
            this.game.startTimer();
        }
        this.clickState = 'left-clicked';   // Register the left-click.
        this.game.numOfLeftClicked++;
        this.css.backgroundImage = this.style.image_LeftClick;
        let mineCount = this.countMines();
        if(mineCount === 0){
            this.adjacent.forEach(cell => cell.leftDown() ); // Recursive left-click on a 'free' cell.
        }
        else {
            this.item.innerHTML = mineCount;
        }
        if(this.game.winCondition()){
            this.game.gameWin();
        }
    }


    countMines(){
        let count = 0;
        this.adjacent.forEach(function(cell){
            if(cell.mineState === 'MINE!')
                count++;
        });
        return count;
    }


    rightDown(){
        if(this.game.midDownFlag){
            return;
        }
        if(this.clickState === 'not-clicked'){
            this.clickState = 'right-clicked';
            this.css.backgroundImage = this.style.image_Flag;
            this.game.numOfRightClicked++;
            this.game.refreshFlagNumberDisplay();
        }
        else if(this.clickState === 'right-clicked'){
            this.clickState = 'not-clicked';
            this.css.backgroundImage = this.style.image_NotClicked;
            this.game.numOfRightClicked--;
            this.game.refreshFlagNumberDisplay();
        }
    }


    midDown(){
        if(this.clickState === 'left-clicked'){
            let mineCount = this.countMines();
            this.adjacent.forEach( adj => {
                if(adj.clickState === 'right-clicked'){
                    mineCount--;
                }
            });
            if(mineCount === 0){
                this.adjacent.forEach(cell => cell.leftDown() );
                return; // Don't highlight if left-clicking. Prevents wrong flag loss problems.
            }
        }
        this.game.midDownFlag = true;
        this.highlight();
    }


    mouseIn(){
        if(this.game.midDownFlag){
            this.highlight();
        }
    }


    mouseOut(){
        if(this.game.midDownFlag){
            this.unHighlight();
        }
    }


    midUp(){
        this.unHighlight();
        this.game.midDownFlag = false;
    }


    highlight(){
        if(this.clickState === 'not-clicked'){
            this.css.backgroundImage = this.style.image_Highlight;
        }
        this.adjacent.forEach( adj => {
            if(adj.clickState === 'not-clicked'){
                adj.css.backgroundImage = this.style.image_Highlight;
            }
        });
    }


    unHighlight(){
        if(this.clickState === 'not-clicked'){
            this.css.backgroundImage = this.style.image_NotClicked;
        }
        this.adjacent.forEach( adj => {
            if(adj.clickState === 'not-clicked'){
                adj.css.backgroundImage = this.style.image_NotClicked;
            }
        });
    }
}