const Gameboard = (() => {
    let board = Array(9).fill(null);

    const getBoard = () => board;

    const makeMove = (index, player) => {
        if (board[index] === null) {
            board[index] = player;
            return true;
        }
        return false;
    };

    const reset = () => {
        board = Array(9).fill(null);
    };

    return { getBoard, makeMove, reset };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            Player('Player 1', 'X'),
            Player('Player 2', 'O')
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.reset();
    };

    const getCurrentPlayer = () => players[currentPlayerIndex];

    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const makeMove = (index) => {
        if (!gameOver && Gameboard.makeMove(index, getCurrentPlayer().marker)) {
            if (checkWinner(index)) {
                gameOver = true;
                return `${getCurrentPlayer().name} wins!`;
            } else if (checkTie()) {
                gameOver = true;
                return "It's a tie!";
            } else {
                switchPlayer();
                return `${getCurrentPlayer().name}'s turn`;
            }
        }
        return null;
    };

    const checkWinner = (index) => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]             
        ];

        return winPatterns
            .filter(pattern => pattern.includes(index))
            .some(pattern => pattern.every(i => Gameboard.getBoard()[i] === getCurrentPlayer().marker));
    };

    const checkTie = () => {
        return Gameboard.getBoard().every(cell => cell !== null);
    };

    return { start, makeMove, getCurrentPlayer };
})();

const DisplayController = (() => {
    const renderBoard = () => {
        const board = Gameboard.getBoard();
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';

        board.forEach((cell, index) => {
            const cellButton = document.createElement('button');
            cellButton.textContent = cell || '';
            cellButton.addEventListener('click', () => {
                const result = GameController.makeMove(index);
                if (result) {
                    renderBoard();
                    if (result.includes('wins') || result.includes('tie')) {
                        alert(result);
                        GameController.start();
                        renderBoard();
                    }
                }
            });
            gameContainer.appendChild(cellButton);
        });
    };

    return { renderBoard };
})();

GameController.start();
DisplayController.renderBoard();