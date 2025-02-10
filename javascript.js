// A target is the Cell() that a player marks during his move
// A player's mark is either X or O for tic-tac-toe
// Each player should input a row and column to determine where to input his mark
function Board() {
    const columns = 3;
    const rows = 3;
    const board = [];
    const move = {
        isValid: false
    }

    let boardStatus = '';
    let winner = undefined;

    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

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
    const createDOMBoard = () => {
        const gameBoard = document.querySelector(".board");
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const cell = document.createElement("div");
                cell.setAttribute("class", `cell row${i} col${j}`);
                cell.textContent = "0";
                gameBoard.appendChild(cell);
            }
        }
    
    }

    const printBoard = () => {
        const boardWithValues = board.map((row) => row.map((cell) => cell.getMove()))
        console.log(boardWithValues);
    }

    function putMove(row, column, playerMark) {
        let targetDOMCell = document.querySelector(`.row${row}.col${column}`)
        let targetCell = board[row][column];
        // Cells with 0 are unfilled, otherwise they're already marked
        // only check the board if move is valid;
        if (targetCell.getMove() === 0) {
            targetDOMCell.textContent = playerMark;
            targetCell.setMove(playerMark);
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
        let currentRow = row === true ? 1 : row;
        let currentCol = column;
        let currentMark = playerMark;
        let patternFound, verticalCheck, horizontalCheck;
        let diagonalCheck = false;

        const checkHorizontally = () => {
            currentRow = currentRow === true ? 1 : currentRow;
            for (let col = 0; col < 3; col++) {
                if (board[currentRow][col].getMove() != currentMark) {
                    return false
                }
            }
            return true
        }
        const checkVertically = () => {
            for (let row = 0; row < 3; row++) {
                if (board[row][currentCol].getMove() != currentMark) {
                    return false
                }
            }
            return true
        }

        const checkDiagonally = () => {
            if (currentRow === 1 && currentCol === 1) {
                return check(isCenter = true)
            }
            else if (currentRow + currentCol === 2 || currentRow === currentCol) {
                return check(isCenter = false)
            }
            else {
                return false
            }

            function check(isCenter = false) {
                /*
                * Indexes for Diagonal patterns
                * (0, 0) \                                  / (0, 2)
                *       (1, 1) \                      / (1, 1)
                *              (2, 2) \    OR   /(2, 0)
                */
                let rowIterations = currentRow === 2 ? [2, 1, 0] : [0, 1, 2]
                let colIterations = currentCol === 2 ? [2, 1, 0] : [0, 1, 2]
                let index = 0;
                let patternFound = true;

                while (index < 3) {
                    let rowIndex = rowIterations[index]
                    let colIndex = colIterations[index]
                    if (board[rowIndex][colIndex].getMove() != currentMark) {
                        patternFound = false
                        break;
                    }
                    index++;
                };

                if (isCenter) {
                    let index = 2
                    while (index >= 0) {
                        let rowIndex = rowIterations[index]
                        let colIndex = colIterations[index]
                        if (board[rowIndex][colIndex].getMove() != currentMark) {
                            patternFound = false
                            break;
                        }
                        index--;
                    }
                }
                return patternFound;
            }
        }

        diagonalCheck = checkDiagonally();
        verticalCheck = checkVertically();
        horizontalCheck = checkHorizontally();
        const getResult = () => {
            patternFound = verticalCheck || horizontalCheck || (diagonalCheck === false ? false : true)
            return patternFound;
        };

        return { getResult, playerMark }
    }
    return { printBoard, putMove, getWinner, getMove, createDOMBoard }
}

function Cell() {
    let currentMove = 0;

    function setMove(move) {
        currentMove = move;
    }

    function getMove() {
        return currentMove;
    }

    return { setMove, getMove }

}

function Players() {

    let player = [{
        name: "Spriya",
        mark: "X"
    }, {
        name: "Seojin",
        mark: "O"
    }]

    return { player }

}

function GamePlay() {
    let board = Board();
    let players = Players();
    let activePlayer = players.player[0];
    let turn = 1;

    function switchActivePlayer() {
        const player1 = players.player[0];
        const player2 = players.player[1];
        return activePlayer = activePlayer === player1 ? player2 : player1
    }

    const getActivePlayer = () => activePlayer;

    const startNewRound = () => {
        board.printBoard();
        console.log(`It is ${getActivePlayer().name}'s turn!`)
    }

    const playRound = (row, column) => {
        console.log(`Starting round ${turn}!`)
        board.putMove(row, column, getActivePlayer().mark)

        const winner = board.getWinner();
        const move = board.getMove();

        if (winner === undefined && turn < 10 && move.isValid) {
            turn++;
            switchActivePlayer();
            startNewRound();
        }
        else if (turn === 10)
            console.log("DRAW")
        if (winner) {
            console.log(`Winner is ${winner.name}`)
            board.printBoard();
        }
    }

    startNewRound();
    board.createDOMBoard();
    return { playRound, getActivePlayer }
}
const game1 = GamePlay();

game1.playRound(0, 0);
game1.playRound(0, 1);
game1.playRound(0, 1);
game1.playRound(2, 2);
game1.playRound(1, 1);
game1.playRound(2, 0);
game1.playRound(2, 1);

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