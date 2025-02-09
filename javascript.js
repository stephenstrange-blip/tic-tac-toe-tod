// A target is the Cell() that a player marks during his move
// A player's mark is either X or O for tic-tac
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
                console.log(`setWinner(): What is the current mark? ${boardStatus.playerMark} and whose is it? ${participant.name}`)
                winner = participant;
            }
        })

    }

    const printBoard = () => {
        const boardWithValues = board.map((row) => row.map((cell) => cell.getMove()))
        console.log(boardWithValues);
    }

    function putMove(row, column, playerMark) {
        let targetCell = board[row][column];
        // console.log(`targetCell is ${targetCell.}`)
        // Cells with 0 are unfilled, otherwise they're already marked
        if (targetCell.getMove() === 0) {
            console.log(`putMove(): move at targetCell is ${targetCell.getMove()}`)
            targetCell.setMove(playerMark);
            console.log(`putMove(): new move at targetCell is ${targetCell.getMove()}`)
            move.isValid = true;
            console.log(`putMove(): Is the move valid? ${move.isValid}`)
            // only check the board if move is valid;
            boardStatus = checkBoard(row, column, playerMark);
            // if a patter is found, set the winner
            if (boardStatus.getResult())
                setWinner();
        } else {
            move.isValid = false;
            return
        }
    }

    const checkBoard = (row, column, playerMark) => {
        console.log(`Board is being checked...`)
        let currentRow = row === true ? 1 : row;
        let currentCol = column;
        let currentMark = playerMark;
        let patternFound, verticalCheck, horizontalCheck;
        let diagonalCheck = false;

        console.log(`Current row and col is ${currentRow} ${currentCol}`)
        const checkHorizontally = () => {
            currentRow = currentRow === true ? 1 : currentRow;
            console.log(`Checking Horizontally...`)
            for (let col = 0; col < 3; col++) {
                console.log(`Is move ${board[currentRow][col].getMove()} not equal to ${currentMark}?`)
                if (board[currentRow][col].getMove() != currentMark) {
                    console.log(`A horizontal mismatch is found. Aborting checking.`);
                    return false
                }
            }
            console.log(`Horizontal Pattern found at checkHorizontally()`);
            return true
        }
        const checkVertically = () => {
            console.log(`Checking Vertically...`)
            for (let row = 0; row < 3; row++) {
                console.log(`Is move ${board[row][currentCol].getMove()} not equal to ${currentMark}?`)
                if (board[row][currentCol].getMove() != currentMark) {
                    console.log(`A vertical mismatch is found. Aborting checking.`);
                    return false
                }
            }
            console.log(`Vertical Pattern found at checkHorizontally()`);
            return true
        }
        const checkDiagonally = () => {
            console.log(`Checking Diagonally...`)
            if (currentRow === 1 && currentCol === 1) {
                console.log(`Is it at the center? ${currentRow = currentCol === 1}`)
                return check(isCenter = true)
            }
            else if (currentRow + currentCol === 2 || currentRow === currentCol) {
                console.log(`Is it not at the center? ${currentRow + currentCol === 2 || currentRow === currentCol}`)
                return check(isCenter = false)
            }
            else {
                return false
            }

            function check(isCenter = false) {
                let rowIterations = currentRow === 2 ? [2, 1, 0] : [0, 1, 2]
                let colIterations = currentCol === 2 ? [2, 1, 0] : [0, 1, 2]
                let index = 0;
                let patternFound = true;

                console.log(`First Diagonal Check`)
                while (index < 3) {

                    let rowIndex = rowIterations[index]
                    let colIndex = colIterations[index]
                    if (board[rowIndex][colIndex].getMove() != currentMark) {
                        console.log(`A diagonal mismatch is found at the first diagonal check. Abort checking`)
                        patternFound = false
                        break;
                    }
                    index++;
                };

                if (isCenter) {
                    console.log(`Second Diagonal Check`)
                    let index = 2
                    while (index >= 0) {
                        let rowIndex = rowIterations[index]
                        let colIndex = colIterations[index]
                        if (board[rowIndex][colIndex].getMove() != currentMark) {
                            console.log(`A diagonal mismatch is found at the second diagonal check. Abort checking`)
                            patternFound = false
                            break;
                        }
                        index--;

                    }
                }
                // console.log(`Diagonal Pattern found at checkDiagonally()`)
                return patternFound;
            }
        }

        diagonalCheck = checkDiagonally();
        verticalCheck = checkVertically();
        horizontalCheck = checkHorizontally();
        const getResult = () => {
            patternFound = verticalCheck || horizontalCheck || (diagonalCheck === false ? false : true)
            console.log(`PatternFound: ${patternFound}`)
            return patternFound;
        };
        console.log(`Vertical Match? : ${verticalCheck}, Horizontal Match? ${horizontalCheck}, Diagonal Match? ${diagonalCheck}`)
        return { getResult, playerMark }
    }
    return { printBoard, putMove, getWinner, getMove }
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
        console.log(winner)
        const move = board.getMove();
        console.log(`winner undefined? ${winner === undefined}, turn < 10? ${turn < 10}, valid move? ${move.isValid}`)
        console.log(`${winner === undefined || (turn < 10 && move.isValid)}`)
        console.log();
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
// game1.playRound(2, 0);
// game1.playRound(0, 2);

// const board = Board();
// console.log(board.board);
// board.printBoard()

// const move1 = Cell();
// move1.setMove("X")
// console.log(move1.getMove());

// let players = Players();
// console.log(players.players[0].name)
// console.log(players.players[0].mark)

// if row === column  || row + column === 2
// row === 1
// checkDiagonally()

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