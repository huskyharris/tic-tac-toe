const gameBoard = (function (){
    let board = ['', '', '', '', '', '', '', '', ''];
    
    const Player = (name, letter) => {
        return {
            name,
            letter,
            turns: [],
            pushTurn: function (index) {
                this.turns.push(index);
            },
            checkIfWin: function () {
                for (let i = 0; i < winConditions.length; i++) {
                    const win = winConditions[i].every(index => this.turns.includes(index));
                    if (win) {
                        return {
                            decision: true,
                            winningIndex: winConditions[i]
                        }
                    }
                }
                return false;
            },
            checkIfDraw: function () {
                const win = this.checkIfWin();
                const boardFilled = isBoardFilled();
                if (!win && boardFilled) {
                    return true;
                } else {
                    return false;
                }
            },
            clearTurns: function () {
                this.turns = [];
            }
        }
    };

    const isBoardFilled = () => {
        return board.every(cell => cell === 'X' || cell === 'O');
    };

    const winConditions = [
        // horizontals
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        // verticals
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        // diagonal
        [0, 4, 8], [2, 4, 6]
    ];

    // AI MINIMAX FUNCTIONS
    const ai = 'O';
    const human = 'X';

    const FindBestMove = () => {
        let bestScore = Infinity;
        let bestMove;
        for (let i = 0; i < 9; i++) {
            // is the spot available/empty?
            if (board[i] === '') {
                board[i] = ai;
                let score = minimax(board, 0, true); // next move would be human/maximizer
                board[i] = '';
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    };

    const threeInARow = () => {
        for (let i = 0; i < winConditions.length; i++) {
            const winX = winConditions[i].every(index => board[index] === 'X');
            const winO = winConditions[i].every(index => board[index] === 'O');
            if (winX) {
                return 'X';
            } else if (winO) {
                return 'O';
            }
        }
        return false;
    };

    const checkTie = () => {
        const win = threeInARow();
        const boardFull = isBoardFilled();
        if (!win && boardFull) {
            return true;
        } else {
            return false;
        }
    };

    const minimax = (gameBoard, depth, isMaximizing) => {
        scores = {
            'X': 100,
            'O': -100,
            'tie': 0
        };
        
        // check for terminal/win
        const winner = threeInARow();
        const draw = checkTie();

        if (winner === 'X') {
            return scores[winner] - depth;
        } else if (winner === 'O') {
            return scores[winner] + depth;
        } else if (draw) {
            return scores['tie'];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                //find empty cell
                if (gameBoard[i] === '') {
                    gameBoard[i] = human;
                    score = minimax(gameBoard, depth + 1, false);
                    gameBoard[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                //find empty cell
                if (gameBoard[i] === '') {
                    gameBoard[i] = ai;
                    score = minimax(gameBoard, depth - 1, true);
                    gameBoard[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };
    
    // public functions 
    const addPlayer = (name, letter) => {
        const player = Player(name, letter);
        return player
    };

    const insertInBoard = (letter, index) => {
        board[index] = letter;
    };

    const insertInData = (player, index) => {
        player.pushTurn(index);
    };

    const checkIfEmpty = index => {
        if (board[index] !== 'X' && board[index] !== 'O') {
            return true;
        } else {
            return false;
        }
    };

    const getBoard = () => {
        return board;
    };

    const clearBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };

    const findEmptyCell = () => {
        const randomCellIndex = Math.floor(Math.random() * 9);
        if (checkIfEmpty(randomCellIndex)) {
            return randomCellIndex;
        } else {
            return findEmptyCell();
        }
    };

    return {
        addPlayer,
        insertInBoard,
        insertInData,
        checkIfEmpty,
        getBoard,
        clearBoard,
        findEmptyCell,
        FindBestMove
    }
})();

const UIController = (function () {
    const images = {
        cross: '<img src="images/cross.png">',
        circle: '<img src="images/circle.png">',
        filledCross: '<img src="images/filled_cross.png">',
        filledCircle: '<img src="images/filled_circle.png">'
    };

    const cellDOMs = Array.from(document.querySelectorAll('.box'));
    const playerOneDot = document.querySelector('.player-one-dot');
    const playerTwoDot = document.querySelector('.player-two-dot');
    const playerOneName = document.getElementById('player-1-name');
    const playerTwoName = document.getElementById('player-2-name');
    const drawText = document.getElementById('draw-text');
    const winnerOne = document.getElementById('winner-1');
    const winnerTwo = document.getElementById('winner-2');
    const modal = document.querySelector('.modal');
    const displayNames = Array.from(document.querySelectorAll('.player-text, .player-name'));
    const modalContent = document.querySelector('.modal-content');

    // public functions
    const renderMove = board => {
        for (let i = 0; i < cellDOMs.length; i++) {
            if (board[i] === 'X') {
                cellDOMs[i].innerHTML = images.cross;
            } else if (board[i] === 'O') {
                cellDOMs[i].innerHTML = images.circle;
            }
        }
    };

    const setPlayerNames = (player1, player2) => {
        playerOneName.textContent = player1.name;
        playerTwoName.textContent = player2.name;
        firstPlayerDot();
    };

    const firstPlayerDot = () => {
        playerOneDot.style.visibility = 'visible';
        playerTwoDot.style.visibility = 'hidden';
    };

    const toggleDot = letter => {
        if (letter === 'X') {
            playerTwoDot.style.visibility = 'visible';
            playerOneDot.style.visibility = 'hidden';
        } else {
            playerOneDot.style.visibility = 'visible';
            playerTwoDot.style.visibility = 'hidden';
        }
    };

    const highlightWin = (winningCombo, letter) => {
        let img;
        letter === 'X' ? img = images.filledCross : img = images.filledCircle;
        winningCombo.forEach(index => {
            document.getElementById(`box${index}`).innerHTML = img;
        })
    };

    const clearBoard = () => {
        cellDOMs.forEach(cell => cell.innerHTML = '');
    };

    const showDraw = () => {
        drawText.textContent = 'DRAW';
        playerOneDot.style.visibility = 'hidden';
        playerTwoDot.style.visibility = 'hidden';
    }

    const hideDraw = () => {
        drawText.textContent = '';
    };

    const setWinner = letter => {
        const text = 'WINNER!';
        letter === 'X' ? winnerOne.textContent = text : winnerTwo.textContent = text;
    };

    const resetPlayers = () => {
        winnerOne.textContent = 'Player 1';
        winnerTwo.textContent = 'Player 2';
        firstPlayerDot();
    };

    const hideModal = () => {
        modal.style.visibility = 'hidden';
    };

    const showNames = () => {
        displayNames.forEach(cur => cur.style.visibility = 'visible');
    }

    const showPlayerForm = () => {
        const formHTML = "<form id='player-form'><p id='enter-text'>Enter Player Names</p><div id='player-x'><label>Player X</label><input id='player-x-name' type='text' required></div><div id='player-o'><label>Player O</label><input id='player-o-name' type='text' required></div><div class='player-buttons'><button type='button' id='back-btn-1'>Back</button><input type='submit' id='submit-btn-1' value='Submit'></div></form>";
        modalContent.innerHTML = formHTML;
        modal.classList.toggle('fade-in');
    };

    const showSingleForm = () => {
        const formHTML = "<form id='single-player-form'><p id='enter-text-2'>Enter Your Name</p><input id='single-name' type='text' required><div class='page-btns'><button type='button' id='back-btn-2'>Back</button><input type='submit' id='submit-btn-2' value='Submit'></div></form>";
        modalContent.innerHTML = formHTML;
        modal.classList.toggle('fade-in');
    }

    const backToModePage = () => {
        const modeHTML = "<div class='select-mode-modal'><p id='select-header'>Welcome to Tic-Tac-Toe</p><p id='select-text'>Choose your game type</p><div class='mode-buttons'><button type='button' id='vs-player-btn'>vs player</button><button type='button' id='vs-easy-btn'>vs Easy AI</button><button type='button' id='vs-hard-btn'>vs Hard AI</button></div></div>";
        modalContent.innerHTML = modeHTML;
        modal.classList.toggle('fade-in');
    };

    return {
        renderMove,
        setPlayerNames,
        firstPlayerDot,
        toggleDot,
        highlightWin,
        clearBoard,
        showDraw,
        hideDraw,
        setWinner,
        resetPlayers,
        hideModal,
        showNames,
        showPlayerForm,
        showSingleForm,
        backToModePage
    }
})();

const gameController = (function () {
    let gamePlaying;
    let clickCount;
    let mode;
    let playerX;
    let playerO;
    let overFlag = false;
    let allowRestart = true;

    const setupEventListeners = () => {
        document.addEventListener('click', clickCell);
        document.getElementById('restart-btn').addEventListener('click', restart);
        Array.from(document.querySelectorAll('#vs-player-btn, #vs-easy-btn, #vs-hard-btn')).forEach(cur => cur.addEventListener('click', selectMode));
    };

    const selectMode = e => {
        const btn = e.target.id;
        if (btn === 'vs-player-btn') {
            mode = 'player';
            UIController.showPlayerForm();
            document.querySelector('#player-form').addEventListener('submit', assignPlayer);
            document.querySelector('#back-btn-1').addEventListener('click', goToPrevPage);
        } else if (btn === 'vs-easy-btn' || btn === 'vs-hard-btn') {
            btn === 'vs-easy-btn' ? mode = 'easyAI' : mode = 'hardAI';
            UIController.showSingleForm();
            document.querySelector('#single-player-form').addEventListener('submit', assignPlayer);
            document.querySelector('#back-btn-2').addEventListener('click', goToPrevPage);
        }
    };

    const goToPrevPage = () => {
        UIController.backToModePage();
        Array.from(document.querySelectorAll('#vs-player-btn, #vs-easy-btn, #vs-hard-btn')).forEach(cur => cur.addEventListener('click', selectMode));
    };

    const restart = () => {
        if (allowRestart) {
            gameBoard.clearBoard();
            playerX.clearTurns();
            playerO.clearTurns();
            clickCount = 0;
            gamePlaying = true;
            overFlag = false;
            UIController.clearBoard();
            UIController.resetPlayers();
            UIController.hideDraw();
        }
    };

    const pushData = (player, cellIndex) => {
        gameBoard.insertInBoard(player.letter, cellIndex);
        gameBoard.insertInData(player, cellIndex);
        UIController.renderMove(gameBoard.getBoard());
    };      

    const gameOver = player => {
        const win = player.checkIfWin();
        const draw = player.checkIfDraw();

        if (win.decision) {
            gamePlaying = false;
            overFlag = true;
            UIController.setWinner(player.letter);
            UIController.highlightWin(win.winningIndex, player.letter);
        } else if (draw) {
            gamePlaying = false;
            overFlag = true;
            UIController.showDraw();
        } else {
            UIController.toggleDot(player.letter);
        }
    };

    const clickCell = e => {
        if (gamePlaying) {
            if (e.target.closest('#board')) {
                const cellIndex = parseInt(e.target.id.substr(-1,1));
                if (cellIndex >= 0 && cellIndex <= 8) {
                    const isEmpty = gameBoard.checkIfEmpty(cellIndex);
                    if (isEmpty) {
                        if (mode === 'player') {
                            let player;
                            clickCount++;
                            if (clickCount % 2 === 1) {
                                player = playerX;
                            } else if (clickCount % 2 === 0) {
                                player = playerO;
                            }
                            pushData(player, cellIndex);
                            gameOver(player);
                        } else if (mode === 'easyAI' || mode === 'hardAI') {
                            // do players move first
                            pushData(playerX, cellIndex);
                            gameOver(playerX);
                            // do computers move right after. find an empty cell from gameboard
                            if (gamePlaying) {
                                let moveIndex;
                                if (mode === 'easyAI') {
                                    moveIndex = gameBoard.findEmptyCell();
                                } else {
                                    moveIndex = gameBoard.FindBestMove();
                                }
                                gamePlaying = false; // freeze game until the timeout finishes running
                                allowRestart = false;
                                setTimeout(() => {
                                    pushData(playerO, moveIndex);
                                    gameOver(playerO);
                                    if (!overFlag) gamePlaying = true;
                                    allowRestart = true;
                                }, 200);
                            }
                        }
                    }
                }
            }
        }
    };

    const assignPlayer = e => {
        e.preventDefault();
        gamePlaying = true;
        if (gamePlaying) {
            if (mode === 'player') {
                const playerXName = document.querySelector('#player-x-name').value;
                const playerOName = document.querySelector('#player-o-name').value;
                playerX = gameBoard.addPlayer(playerXName, 'X');
                playerO = gameBoard.addPlayer(playerOName, 'O');
                document.querySelector('#player-form').reset();
                prepareUI();
            } else if (mode === 'easyAI' || mode === 'hardAI') {
                const firstPlayerX = document.querySelector('#single-name').value;
                playerX = gameBoard.addPlayer(firstPlayerX, 'X');
                playerO = gameBoard.addPlayer('Computer', 'O');
                document.querySelector('#single-player-form').reset();
                prepareUI();
            }
        }
    };

    const prepareUI = () => {
        UIController.setPlayerNames(playerX, playerO);
        UIController.hideModal();
        UIController.showNames();
    };

    return {
        init: function () {
            gamePlaying = false;
            clickCount = 0;
            setupEventListeners();
        }
    }
})(gameBoard, UIController);

gameController.init();