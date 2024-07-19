const Gameboard = (() => {
    let board = Array(9).fill(null);

    const getBoard = () => board;
    const setCell = (index, value) => {
        if (index >= 0 && index < 9 && board[index] === null) {
            board[index] = value;
            return true;
        }
        return false;
    };
    const reset = () => board = Array(9).fill(null);

    return { getBoard, setCell, reset };
})();

const Player = (name, marker) => ({ name, marker });

const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;

    const initialize = (player1Name, player2Name) => {
        players = [Player(player1Name, 'X'), Player(player2Name, 'O')];
        currentPlayerIndex = 0;
        Gameboard.reset();
    };

    const getCurrentPlayer = () => players[currentPlayerIndex];

    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const checkWinner = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        const board = Gameboard.getBoard();
        return winPatterns.some(pattern => 
            board[pattern[0]] && 
            board[pattern[0]] === board[pattern[1]] && 
            board[pattern[0]] === board[pattern[2]]
        );
    };

    const checkTie = () => Gameboard.getBoard().every(cell => cell !== null);

    return { initialize, getCurrentPlayer, switchPlayer, checkWinner, checkTie };
})();

const DisplayController = (() => {
    const gameSetup = document.getElementById('game-setup');
    const gameContainer = document.getElementById('game-container');
    const gameStatus = document.getElementById('game-status');
    const startGameBtn = document.getElementById('start-game');
    const restartGameBtn = document.getElementById('restart-game');
    const player1Input = document.getElementById('player1-name');
    const player2Input = document.getElementById('player2-name');

    const init = () => {
        startGameBtn.addEventListener('click', startGame);
        restartGameBtn.addEventListener('click', restartGame);
        renderBoard();
    };

    const startGame = () => {
        const player1Name = player1Input.value || 'Player 1';
        const player2Name = player2Input.value || 'Player 2';
        GameController.initialize(player1Name, player2Name);
        updateUI();
    };

    const restartGame = () => {
        GameController.initialize(player1Input.value || 'Player 1', player2Input.value || 'Player 2');
        updateUI();
    };

    const updateUI = () => {
        gameSetup.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        restartGameBtn.classList.remove('hidden');
        renderBoard();
        updateGameStatus(`${GameController.getCurrentPlayer().name}'s turn`);
    };

    const renderBoard = () => {
        gameContainer.innerHTML = '';
        Gameboard.getBoard().forEach((cell, index) => {
            const cellButton = document.createElement('button');
            cellButton.textContent = cell || '';
            cellButton.addEventListener('click', () => makeMove(index));
            gameContainer.appendChild(cellButton);
        });
    };

    const makeMove = (index) => {
        const currentPlayer = GameController.getCurrentPlayer();
        if (Gameboard.setCell(index, currentPlayer.marker)) {
            renderBoard();
            if (GameController.checkWinner()) {
                endGame(`${currentPlayer.name} wins!`);
            } else if (GameController.checkTie()) {
                endGame("It's a tie!");
            } else {
                GameController.switchPlayer();
                updateGameStatus(`${GameController.getCurrentPlayer().name}'s turn`);
            }
        }
    };

    const endGame = (message) => {
        updateGameStatus(message);
        setTimeout(() => {
            restartGame();
        }, 10000);
    };

    const updateGameStatus = (status) => {
        gameStatus.textContent = status;
    };

    return { init };
})();

DisplayController.init();