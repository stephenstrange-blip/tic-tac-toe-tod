// A target is the Cell() that a player marks during his move
// A player's mark is either X or O for tic-tac-toe
// Each player should input a row and column to determine where to input his mark
function GameBoard() {
    const columns = 3;
    const rows = 3;
    const board = [];
    const move = {
        isValid: false
    }

    let boardStatus = '';
    let winner = undefined;

    // IIFEs for creating the board, both console and DOM
    // They are immediately called once
    (function createBoard() {
        for (let i = 0; i < rows; i++) {
            board[i] = []
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    })();

    (function createDOMBoard() {
        const gameBoard = document.querySelector(".board");
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const cell = document.createElement("div");
                const button = document.createElement("button");

                button.setAttribute("class", `row${i} col${j}`);
                button.textContent = "";

                cell.appendChild(button);
                gameBoard.appendChild(cell);
            }
        }
    }());

    const getMove = () => move;
    const getWinner = () => winner;

    const setWinner = () => {
        let players = Players().player;
        // check the mark on the checkBoard against the mark of the players
        players.forEach((participant) => {
            if (participant.mark === boardStatus.playerMark) {
                winner = participant;
            }
        })

    }


    const printBoard = () => {
        console.log();
        const boardWithValues = board.map((row) => row.map((cell) => cell.getMove()))
        console.log(boardWithValues);
    }

    function putMove(row, column, playerMark) {

        let targetCell = board[row][column];
        // Cells with 0 are unfilled, otherwise they're already marked
        // only check the board if move is valid;
        if (targetCell.getMove() === '.') {
            targetCell.setMove(row, column, playerMark);
            move.isValid = true;
            boardStatus = checkBoard(row, column, playerMark);
            // if a pattern is found, set the winner
            if (boardStatus.getResult())
                setWinner();
        } else {
            move.isValid = false;
            return
        }
    }

    const checkBoard = (row, column, playerMark) => {
        let currentRow = row;
        let currentCol = column;
        let currentMark = playerMark;

        const highlightCell = (row, column) => {
            let cell = document.querySelector(`.row${row}.col${column}`)
            Object.assign(cell.style, {
                boxShadow: "rgb(255, 0, 0) 0 0 1rem",
                border: "1px solid rgb(255,0 ,0)"
            })
        }
        const highLightPattern = (direction, isDown = false) => {
            if (direction === "vertical") {
                for (let row = 0; row < 3; row++) {
                    highlightCell(row, currentCol);
                }
            }
            if (direction === "horizontal") {
                currentRow = currentRow === true ? 1 : currentRow;
                for (let col = 0; col < 3; col++) {
                    highlightCell(currentRow, col);
                }
            };
            if (direction === "diagonal" && isDown === true) {
                console.log(`What is the direction? ${direction} and is it going down? ${isDown}`)
                let index = 0;
                let rowIterations = [0, 1, 2]
                let colIterations = [0, 1, 2]
                while (index < 3) {
                    highlightCell(rowIterations[index], colIterations[index])
                    index++;
                }
            }
            if (direction === "diagonal" && isDown === false) {
                console.log(`What is the direction? ${direction} and is it going down? ${isDown}`)
                let index = 0;
                let rowIterations = [0, 1, 2]
                let colIterations = [2, 1, 0]
                while (index < 3) {
                    highlightCell(rowIterations[index], colIterations[index])
                    index++;
                }
            }
        }
        const checkHorizontally = () => {
            currentRow = currentRow === true ? 1 : currentRow;
            for (let col = 0; col < 3; col++) {
                if (board[currentRow][col].getMove() != currentMark) {
                    return false
                }
            }
            highLightPattern("horizontal")
            return true
        }
        const checkVertically = () => {
            for (let row = 0; row < 3; row++) {
                if (board[row][currentCol].getMove() != currentMark) {
                    return false
                }
            }
            highLightPattern("vertical")
            return true
        }

        const checkDiagonally = (dRow = 0, dCol = 0, rowAddend = 1, colAddend = 1, match = 0) => {
            let _dRow = dRow === true ? 1 : dRow;
            let move = board[_dRow][dCol].getMove();

            if (move !== currentMark) {
                // Mismatch at the first edge cases prompts a diagonal check in the other direction
                if (_dRow === 2 && dCol === 2) {
                    return checkDiagonally(_dRow, 0, rowAddend = -1, colAddend = 1, match = 0)
                }
                // Second Edge case mismatch means no diagonal match at all
                else if (_dRow === 0 && dCol === 2) {
                    return false
                }
            }
            else {
                match++;
                // A match of 3 consecutive is considered to be a pattern match
                if (_dRow === 2 && dCol === 2 && match === 3) {
                    highLightPattern("diagonal", isDown = true)
                    return true
                } else if (_dRow === 2 && dCol === 2 && match !== 3) {
                    return checkDiagonally(_dRow, 0, rowAddend = -1, colAddend = 1, match = 0)
                    // A match of 3 consecutive in the other diagonal direction
                } else if (_dRow === 0 && dCol === 2 && match === 3) {
                    highLightPattern("diagonal", isDown = false)
                    return true
                } else if (_dRow === 0 && dCol === 2) {
                    return false
                }
            }
            return checkDiagonally(_dRow + rowAddend, dCol + colAddend, rowAddend, colAddend, match)
        }

        const getResult = () => {
            let diagonalCheck = checkDiagonally();
            let verticalCheck = checkVertically();
            let horizontalCheck = checkHorizontally();
            patternFound = verticalCheck || horizontalCheck || (diagonalCheck === false ? false : true)
            return patternFound;
        };

        return { getResult, playerMark }
    }
    return { printBoard, putMove, getWinner, getMove }
}

function Cell() {
    let currentMove = '.';

    function setMove(row, column, move) {
        let targetDOMCellButton = document.querySelector(`.row${row}.col${column}`)
        currentMove = move;
        targetDOMCellButton.textContent = currentMove;
    }

    function getMove() {
        return currentMove;
    }

    return { setMove, getMove }

}

function Players() {

    let player = [{
        name: "Spriya",
        mark: "X",
        score: 0
    }, {
        name: "Seojin",
        mark: "O",
        score: 0
    }]

    return { player }

}

function GamePlay() {
    let board = GameBoard();
    let players = Players();
    let activePlayer = players.player[0];
    let turn = 1;

    function switchActivePlayer() {
        const player1 = players.player[0];
        const player2 = players.player[1];
        return activePlayer = activePlayer === player1 ? player2 : player1
    }

    const getWinner = () => board.getWinner();
    const getActivePlayer = () => activePlayer;

    const connectBtn = (button) => {
        const [row, col] = button.classList;
        const rowNum = parseInt(row[row.length - 1]);
        const colNum = parseInt(col[col.length - 1]);
        playRound(rowNum, colNum);
    }
    const connectBtnClick = () => {
        const controller = new AbortController();
        const buttons = document.querySelectorAll(".board button");
        buttons.forEach((button) => {
            // https://stackoverflow.com/questions/16310423/addeventlistener-calls-the-function-without-me-even-asking-it-to
            button.addEventListener("click", () => {
                connectBtn(button);
                if (getWinner() !== undefined) {
                    controller.abort();
                }
            }, { signal: controller.signal })
        })
    };

    const startNewRound = () => {
        board.printBoard();
        console.log(`It is ${getActivePlayer().name}'s turn!`)
    };

    const playRound = (row, column) => {

        console.log(`Starting round ${turn}!`)
        board.putMove(row, column, getActivePlayer().mark)
        const move = board.getMove();
        const winner = getWinner();

        if (winner === undefined && turn < 10 && move.isValid) {
            turn++;
            switchActivePlayer();
            startNewRound();
        }
        else if (turn === 10)
            console.log("DRAW")
        if (winner) {
            winner.score++;
            console.log(`Winner is ${winner.name} and score is ${winner.score}`)
            board.printBoard();
        }
    }
    startNewRound();
    connectBtnClick();
    return { playRound, getActivePlayer, getWinner }
}

function Main() {
    let game;

    const updateScreen = () => {
        const board = document.querySelector(".board")
        board.textContent = ''
        game = GamePlay();
    }
    const [newGame, resetGame] = document.querySelectorAll("div[class$=game] > button");
    newGame.addEventListener("click", () => {
        updateScreen();
    })
    resetGame.addEventListener("click", () => {
        updateScreen();
        
    })
}
Main();
// const game1 = GamePlay();
// at row=0, column=0
// check horizontally at row 0, from column 0 - 2
// check vertically at column 0, from row 0 - 2
// check diagonally at outer row loop 0 - 2, inner column loop 0 - 2
// at row=0, column=1
// check horizontally at row 0, from column 0 - 2
// check vertically at column 1, from row 0 - 2
// at row=0, column=2
// check horizontally at row 0, from column 0 - 2
// check vertically at column 2, from row 0 - 2
// check diagonally at outer row loop 0 - 2, inner column loop 2 - 0

// at row=1, column=0
// check horizontally at row 1, from column 0 - 2
// check vertically at column 0, from row 0 - 2
// at row=1, column=1
// check horizontally at row 1, from column 0 - 2
// check vertically at column 1, from row 0 - 2
// check diagonally at outer row loop 0 - 2, inner column loop 0 - 2
// check diagonally at outer row loop 2 - 0, inner column loop 2 - 0
// at row=1, column=2
// check horizontally at row 1, from column 0 - 2
// check vertically at column 2, from row 0 - 2

// at row=2, column=0
// check horizontally at row 2, from column 0 - 2
// check vertically at column 0, from row 0 - 2
// check diagonally at outer row loop 2 - 0, inner column loop 0 - 2
// at row=2, column=1
// check horizontally at row 2, from column 0 - 2
// check vertically at column 1, from row 0 - 2
// at row=2, column=2
// check horizontally at row 2, from column 0 - 2
// check vertically at column 2, from row 0 - 2
// check diagonally at outer row loop 2 - 0, inner column loop 2 - 0