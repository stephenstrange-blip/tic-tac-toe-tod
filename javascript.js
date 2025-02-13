// A target is the Cell() that a player marks during his move
// A player's mark is either X or O for tic-tac-toe
// Each player should input a row and column to determine where to input his mark
function GameBoard(players) {
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
        let participants = players.player;
        console.log(players)
        // check the mark on the checkBoard against the mark of the players
        participants.forEach((participant) => {
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
    }// connectBtnClick();

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
                // Mismatch at the first diagonal edge prompts a diagonal check in the other direction
                if (_dRow === 2 && dCol === 2) {
                    return checkDiagonally(_dRow, 0, rowAddend = -1, colAddend = 1, match = 0)
                }
                // Second Diagonal Edge mismatch means no diagonal match at all
                else if (_dRow === 0 && dCol === 2) {
                    return false
                }
            }
            else {
                match++;
                // 3 consecutive matches is considered to be a pattern match
                if (_dRow === 2 && dCol === 2 && match === 3) {
                    highLightPattern("diagonal", isDown = true)
                    return true
                    // Reverts the match count at the start of the second diagonal check
                } else if (_dRow === 2 && dCol === 2 && match !== 3) {
                    return checkDiagonally(_dRow, 0, rowAddend = -1, colAddend = 1, match = 0)
                    // Same with the other direction
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
        name: "",
        mark: "X",
        score: 0
    }, {
        name: "",
        mark: "O",
        score: 0
    }]

    return { player }

}

function GamePlay(startNewGame, players) {

    let board = GameBoard(players);
    let activePlayer = players.player[0];
    let turn = 0;

    function switchActivePlayer() {
        const player1 = players.player[0];
        const player2 = players.player[1];
        return activePlayer = activePlayer === player1 ? player2 : player1
    }

    const getWinner = () => board.getWinner();
    const getActivePlayer = () => activePlayer;

    const askForNames = () => {
        const dialog = document.querySelector("dialog");
        const confirmBtn = document.querySelector("#confirm");
        const cancelBtn = document.querySelector("#cancel")
        const [p1Name, p2Name] = document.querySelectorAll("input");
        const board = document.querySelector(".board");

        dialog.showModal();

        cancelBtn.addEventListener("click", () => { 
            board.textContent = '';
            const continueBtn = document.querySelector(".continue-game > button");
            continueBtn.setAttribute("disabled", "true")
        })

        dialog.addEventListener("close", () => {
            const [p1NameOutput, p2NameOutput] = document.querySelectorAll("#name");
            p1NameOutput.textContent = `${players.player[0].name}  (${players.player[0].mark})`;
            p2NameOutput.textContent = `${players.player[1].name}  (${players.player[1].mark})`;
        })

        confirmBtn.addEventListener("click", (event) => {
            event.preventDefault();
            if (p1Name && p2Name) {
                players.player[0].name = p1Name.value;
                players.player[1].name = p2Name.value;
            }
            const continueBtn = document.querySelector(".continue-game > button");
            continueBtn.removeAttribute("disabled");
            dialog.close();
        })

    }
    const resetScore = () => {
        const scoreOutputs = document.querySelectorAll("div[id^=score]");
        console.log(scoreOutputs);
        scoreOutputs.forEach(output => output.textContent = "0")
        players.player.forEach((participant) => {
            participant.score = 0;
        })
    }
    const updateScore = (winner) => {
        let participants = players.player
        console.log(participants)
        participants.forEach((participant) => {
            if (participant.mark === winner.mark) {
                console.log(participants.indexOf(participant));
                const scoreOutput = document.querySelector(`#score${participants.indexOf(participant) + 1}`)
                console.log(participant.score, participant.name)
                scoreOutput.textContent = participant.score;
            }

        })
    }

    const connectBtn = (button) => {
        const [row, col] = button.classList;
        const rowNum = parseInt(row[row.length - 1]);
        const colNum = parseInt(col[col.length - 1]);
        playRound(rowNum, colNum);
    }

    const connectBtnClick = (() => {
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
    })();

    const startNewRound = () => {
        if (turn === 0 && startNewGame) {
            askForNames();
            resetScore();
        }

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
            console.log(winner)
            winner.score++;
            console.log(`Winner is ${winner.name} and score is ${winner.score}`)
            board.printBoard();
            updateScore(winner);
        }
    }

    startNewRound();
    return { playRound, getActivePlayer, getWinner }
}

function Main() {
    let game;
    let players = Players();
    const board = document.querySelector(".board")
    const updateScreen = (isNewGame) => {
        board.textContent = ''
        game = GamePlay(startNewGame = isNewGame, players);
    }
    const [continueGame, newGame] = document.querySelectorAll("div[class$=game] > button");
    newGame.addEventListener("click", () => {
        updateScreen(isNewGame = true);
    })

    function handleContinue() {

    }
    continueGame.addEventListener("click", () => {
        updateScreen(isNewGame = false);
    })
}
Main();
