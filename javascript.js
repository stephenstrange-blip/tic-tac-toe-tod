function Board() {
    const columns = 3;
    const rows = 3;
    const board = []
    

    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                console.log(`[${board[i][j].getMove()}]`)
            }
        }
        const boardWithValues = board.map((row) => row.map((cell) => cell.getMove()))
        console.log(boardWithValues);
    }
    function putMove(row, column, playerMark) {
        if (board[row][column].getMove() != 0)
            board[row][column].setMove(playerMark);
        else return
    }
    return { getBoard, printBoard, putMove }
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
        board.putMove(row, column, getActivePlayer().mark)
        switchActivePlayer();
        startNewRound();
    }

    startNewRound();
    return { playRound, getActivePlayer }
}

const board = Board();
// console.log(board.board);
board.printBoard()

// const move1 = Cell();
// move1.setMove("X")
// console.log(move1.getMove());

// let players = Players();
// console.log(players.players[0].name)
// console.log(players.players[0].mark)
