// Gameboard Module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
  
    const getBoard = () => board;
  
    const setCell = (index, mark) => {
      if (board[index] === "") board[index] = mark;
    };
  
    const resetBoard = () => {
      board = ["", "", "", "", "", "", "", "", ""];
    };
  
    return { getBoard, setCell, resetBoard };
  })();
  
  // Player Factory
  const Player = (name, marker) => {
    return { name, marker };
  };
  
  // Game Controller Module
  const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let isGameOver = false;
  
    const startGame = (player1Name, player2Name) => {
      players = [
        Player(player1Name || "Player 1", "X"),
        Player(player2Name || "Player 2", "O"),
      ];
      currentPlayerIndex = 0;
      isGameOver = false;
      Gameboard.resetBoard();
      DisplayController.renderBoard();
      DisplayController.updateTurn(players[currentPlayerIndex].name);
    };
  
    const playTurn = (index) => {
      if (isGameOver) return;
      const board = Gameboard.getBoard();
      if (board[index] === "") {
        Gameboard.setCell(index, players[currentPlayerIndex].marker);
        if (checkWinner()) {
          DisplayController.displayWinner(`${players[currentPlayerIndex].name} wins!`);
          isGameOver = true;
        } else if (board.every(cell => cell !== "")) {
          DisplayController.displayWinner("It's a Tie!");
          isGameOver = true;
        } else {
          currentPlayerIndex = (currentPlayerIndex + 1) % 2;
          DisplayController.updateTurn(players[currentPlayerIndex].name);
        }
        DisplayController.renderBoard();
      }
    };
  
    const checkWinner = () => {
      const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
      ];
      return winConditions.some(condition =>
        condition.every(index => Gameboard.getBoard()[index] === players[currentPlayerIndex].marker)
      );
    };
  
    return { startGame, playTurn };
  })();
  
  // Display Controller Module
  const DisplayController = (() => {
    const gameboardDiv = document.getElementById("gameboard");
    const winnerDisplay = document.getElementById("winner");
  
    const renderBoard = () => {
      gameboardDiv.innerHTML = "";
      Gameboard.getBoard().forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.textContent = cell;
        cellDiv.addEventListener("click", () => GameController.playTurn(index));
        gameboardDiv.appendChild(cellDiv);
      });
    };
  
    const displayWinner = (message) => {
      winnerDisplay.textContent = message;
    };
  
    const updateTurn = (playerName) => {
      winnerDisplay.textContent = `${playerName}'s Turn`;
    };
  
    return { renderBoard, displayWinner, updateTurn };
  })();
  
  // Event Listeners
  document.getElementById("start").addEventListener("click", () => {
    const player1 = document.getElementById("player1").value;
    const player2 = document.getElementById("player2").value;
    GameController.startGame(player1, player2);
  });
  
  document.getElementById("restart").addEventListener("click", () => {
    GameController.startGame();
  });