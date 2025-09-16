// Declaring our variable for our 2d array, score , row and 

// 2d array, an array of array
let board;
let score = 0;

let rows = 4;
let columns = 4;

// Create a function that will initialize the gameboard:
function setGame(){
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]

	// Creating the gameboard and tile using the Javascript
	// for loop
	for (let r = 0 ; r < rows; r++){
		for(let c = 0; c < columns; c++){

			let tile = document.createElement("div");

			// we will be setting the id of the tile for identification purpose:
			tile.id = r + "-" + c;

			// console.log(tile.id);
			let num = board[r][c]

			// This is where we will be updating the tile:
			updateTile(tile, num);

			//This means that tile will now added to the board.
			document.getElementById("board").append(tile);

		}
	}

	// two random tiles at the start of the game.
	setTwo();
	setTwo();

}

// separate function for updating the style
function updateTile(tile, num){
	// remove the content of our tile:
	tile.innerText = "";

	// clear the classList to avoid multiple classes
	tile.classList.value = "";

	tile.classList.add('tile');

	// add a filter to check the value of our num
	if(num > 0){
		tile.innerText = num.toString();

		if(num <= 4096){
			tile.classList.add("x" + num.toString());
		}else{
			tile.classList.add("x8192");
		}
	}
}


// This event will trigger or run the setGame function once our webpage finishes loading.
window.onload = function (){
	setGame();
}

// Function that will handle the user's keyboard input when they press.
function handleSlide(event){
	// console.log(event.code);

	if(["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(event.code)){
		// Prevent default behavior(scrolling) on arrow keys.
		event.preventDefault();

		if(event.code == "ArrowLeft" && canMoveLeft()){

			slideLeft();
			setTwo();

		}else if(event.code == "ArrowRight" && canMoveRight()){

			slideRight();
			setTwo();

		}else if (event.code == "ArrowUp" && canMoveUp()){

			slideUp();
			setTwo();

		}else if(event.code == "ArrowDown" && canMoveDown()){

			slideDown();
			setTwo();
		}
	}
}

document.addEventListener("keydown", handleSlide);

function slideLeft(){
	for(let r = 0; r < rows; r++){
		let row = board[r];
		let originalRow = row.slice(); // Make a copy of the original row

		row = slide(row);
		board[r] = row;

		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];
			if(originalRow[c] !== num && num !==0) { // Update only if the tile has changed
				tile.style.animation = "slide-from-right 0.3s ease"; // Add slide animation
				setTimeout(() => {
					tile.style.animation = ""; // Remove animation after it completes
				}, 300);
			updateTile(tile, num);
		}
	}

	}
}

function slideRight(){
	for(let r = 0; r < rows; r++){
		//[2, 0, 2, 0]
		let row = board[r];
		let originalRow = row.slice(); // Make a copy of the original row

		//[0, 2, 0, 2]
		row.reverse();

		//[4, 0, 0, 0]
		row = slide (row);

		//[0, 0, 0, 4]
		row.reverse();

		board[r] = row;

		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];

			if(originalRow[c] !== num && num !==0) { // Update only if the tile has changed
				tile.style.animation = "slide-from-left 0.3s ease"; // Add slide animation
				setTimeout(() => {
					tile.style.animation = ""; // Remove animation after it completes
				}, 300);
			updateTile(tile, num);
		}
		}


	}
}

function slideUp(){
	for(let c = 0; c < columns ; c++){
		// [2,0,0,8]
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		// first iteration:
		// [board[0][0], board[1][0], board[2][0], board[3][0]] = 

		let originalCol = col.slice(); // Make a copy of the original column
		// [2, 8, 0, 0]
		col = slide(col);

		for (let r = 0; r < rows; r++){
			board[r][c]  = col[r];

			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];
			if(originalCol[r] !== num && num !==0) { // Update only if the tile has changed
				tile.style.animation = "slide-from-bottom 0.3s ease";
				setTimeout(() => {
					tile.style.animation = ""; // Remove animation after it completes
				}, 300);
			}
			updateTile(tile, num)
		}
	}
}

function slideDown(){
	for(let c = 0; c <columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		let originalCol = col.slice(); // Make a copy of the original column
		col.reverse();
		col = slide(col);
		col.reverse();

		for (let r = 0; r < rows; r++){
			board[r][c]  = col[r];

			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];
			if(originalCol[r] !== num && num !==0) { // Update only if the tile has changed
				tile.style.animation = "slide-from-top 0.3s ease";
				setTimeout(() => {
					tile.style.animation = ""; // Remove animation after it completes
				}, 300);
			}
			updateTile(tile, num)
		}

	}
}






function filterZero(row){
	// remove the empty tiles or it will remove the element with value 0
	return row.filter(num => num != 0);
}

function slide(row){
	//[2, 0, 2, 4]
	row = filterZero(row);
	//[2, 2, 4]

	//[2, 2, 4] => [4, 0, 4]

	//[4, 4, 4] => [8, 0, 4] => [8, 4, 0, 0]
	for( let i = 0; i < row.length -1; i++){
		if(row[i] == row[i+1]){
			row[i] *= 2;
			row[i+1] = 0;
			score += row[i]
		}
	}

	// [8, 0, 4] => [8, 4] => [8, 4, 0, 0]
	row = filterZero(row);

	while(row.length < columns){
		//add zero on the end of the array
		row.push(0);
	}
	return row;
}




/*
[
	[2, 4, 8, 16],
	[32, 64, 128, 256],
	[512, 1024, 2048, 2],
	[8, 4, 16, 32]
]
*/
// check whether there is an empty tile or none
function hasEmptyTile(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c< columns; c++){
			if(board[r][c] == 0 ){
				return true;
			}
		}
	}

	//return false if no tile == 0;
	return false;
}

// we will creating a function that at the start will randomly create a tile and add tile in every movement in the game.

function setTwo(){
	//check if the board has empty tile:
	if(!hasEmptyTile){
		return;
	}


	// Declare a value found(false);
	let found = false;

	while(!found){

		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0){
			board[r][c] = 2;
			let tile = document.getElementById(r + '-' + c);
			tile.innerText = "2";
			tile.classList.add('x2');

			found = true;
		}
	}
}

//function that will check if we can still do left movement:
function canMoveLeft(){
    for(let r = 0; r < rows; r++){
        for(let c = 1; c < columns; c++){ // start at 1
            if(board[r][c] !== 0){
                if(board[r][c - 1] === 0 || board[r][c - 1] === board[r][c]){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns - 1; c++){ // stop at 2
            if(board[r][c] !== 0){
                if(board[r][c + 1] === 0 || board[r][c + 1] === board[r][c]){
                    return true;
                }
            }
        }
    }
    return false;
}


function canMoveUp(){
    for(let r = 1; r < rows; r++){ // start at 1
        for(let c = 0; c < columns; c++){
            if(board[r][c] !== 0){
                if(board[r - 1][c] === 0 || board[r - 1][c] === board[r][c]){
                    return true;
                }
            }
        }
    }
    return false;
}
function canMoveDown(){
    for(let r = 0; r < rows - 1; r++){ // stop at rows-2
        for(let c = 0; c < columns; c++){
            if(board[r][c] !== 0){
                if(board[r + 1][c] === 0 || board[r + 1][c] === board[r][c]){
                    return true;
                }
            }
        }
    }
    return false;
}

function checkWin(){
	for (let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 2048){
				return true;
			}
		}
	}		
}

function scoreCount(){
	document.getElementById("score").innerText = score;
}