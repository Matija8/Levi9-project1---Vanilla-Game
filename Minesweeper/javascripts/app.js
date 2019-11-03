'use strict';
/* jshint browser: true */
/*jshint esversion: 6 */

//Initial play area dimensions. Set as desired.
var numOfRows = 7,
    numOfCols = 9,
    numOfMines = 5;


//Object constructors:
class Game {
    constructor(numOfRows, numOfCols, numOfMines){
        this.numOfLeftClicked = 0;
        this.numOfRightClicked = 0;
        this.seconds = 0;
        this.firstClick = true;
        this.cellMatrix = [];
        this.initPlayArea();
        this.setAdjacentCells(this.cellMatrix);
    }//constructor

    initPlayArea(){
        var tableDOM = document.createElement('div');
        tableDOM.setAttribute('id', 'play-area');
        for (var i = 0; i < numOfRows; i++) {
            var rowDOM = document.createElement('div'), row = [];
            rowDOM.classList.add('row');
            for (var j = 0; j < numOfCols; j++) {
                var cellDOM = document.createElement('div');
                cellDOM.classList.add('cell');
                cellDOM.innerText = i + ',' + j;
                rowDOM.appendChild(cellDOM);
                row.push(new Cell(cellDOM));
            }
            this.cellMatrix.push(row);
            tableDOM.appendChild(rowDOM);
        }
        document.getElementById('play-area-container').appendChild(tableDOM);
    }//initPlayArea

    setAdjacentCells(matrix) {
        for (var i = 0; i < numOfRows; i++) {
            for (var j = 0; j < numOfCols; j++) {
                matrix[i][j].adjacent.push('test');
            }
        }
    }//setAdjacentCells

    toString() {
        
    }

}//class Game


class Cell {
    constructor(item, game){
        this.item = item; //DOM object reference.
        this.game = game; //Game object.
        this.mineState = 'no-mine'; // {'no-mine', 'MINE!'} 
        this.clickState = 'not-clicked'; // {'not-clicked', 'left-clicked', 'right-clicked'}
        this.adjacent = [];
        this.item.addEventListener('mousedown', (event) => { this.mouseDown(event); });
        this.item.addEventListener('mouseup', (event) => { this.mouseUp(event); });
        this.item.addEventListener('contextmenu', (event) => { event.preventDefault(); });
    }

    mouseDown(event){
        switch(event.button) {
            case 0:
                this.leftDown(); break;
            case 1:
                this.midDown(); break;
            case 2:
                this.rightDown(event);break;
        }
    }

    mouseUp(event){
        switch(event.button) {
            case 0:
                this.leftUp(); break;
            case 1:
                this.midUp(); break;
            case 2:
                this.rightUp();break;
        }
    }

    leftDown(){
        console.log('LeftDown');
    }

    leftUp(){
        console.log('LeftUp');
    }

    midDown(){
        console.log('MidDown');
    }

    midUp(){
        console.log('MidUp');
    }

    rightDown(){
        console.log('RightDown');
    }

    rightUp(){
        console.log('RightUp');
    }
}


new Game(numOfRows, numOfCols, numOfMines);

document.getElementById('new-game').addEventListener('click', (event) => { location.reload(); });