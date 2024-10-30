const gameboard = (() => {
  let boardLayout = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const getBoardArrayLayout = () => boardLayout;
  const checkTie = () => {
    for (const i of boardLayout) {
      if (typeof i === "number") return false;
    }
    // if none of them are a number, it is a tie
    return true;
  };

  let lastWinningCombinationIndexes = "";
  const getLastWinningCombination = () => lastWinningCombinationIndexes;
  const checkWinningCombinations = (arr) => {
    // The function receives an array and checks wether that array is a winner
    if (
      boardLayout[arr[0]] === boardLayout[arr[1]] &&
      boardLayout[arr[1]] === boardLayout[arr[2]]
    ) {
      // Keep the last winning combination
      lastWinningCombinationIndexes = arr;
      return true;
    } else {
      return false;
    }
  };
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];
  const checkWinner = () => {
    // For each winning combination it calls the function to see whether there is a winner
    for (const i of winningCombinations) {
      if (checkWinningCombinations(i)) {
        return true;
      } else {
        continue;
      }
    }
    // if nothing returns false
    return false;
  };

  const changeBoardArrayLayout = (mark, position) => {
    // Changes the layout while also looking for winners
    if (boardLayout[position] === "x" || boardLayout[position] === "o") return;
    boardLayout[position] = mark;
    // maybe do this outside of here? TODO ?
    return checkWinner();
  };
  const resetBoard = () => {
    boardLayout = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Also reset last wining combination
    lastWinningCombinationIndexes = "";
  };
  return {
    getBoardArrayLayout,
    changeBoardArrayLayout,
    checkWinner,
    resetBoard,
    checkTie,
    getLastWinningCombination,
  };
})();

const createPlayer = (playerName, playerMark) => {
  const name = playerName;
  const mark = playerMark;
  let score = 0;
  const getName = () => name;

  const getMark = () => mark;

  const getScore = () => score;

  const increaseScore = () => score++;

  return { getName, getMark, getScore, increaseScore };
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const playerOne = createPlayer("player1.", "x");
const playerTwo = createPlayer("playerx.", "o");

const displayController = (() => {
  const X =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>alpha-x</title><path d="M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z" /></svg>';
  const O =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>alpha-o</title><path d="M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9Z" /></svg>';
  const cellsContainer = document.querySelector("#cells-container");
  const cells = cellsContainer.children;

  // Change the cell to add an svg
  const changeCell = (cellIndex, mark) => {
    // This takes the O or X svg and adds it to its inner html
    mark === "x" ? (mark = X) : (mark = O);
    // only if there isnt some already
    if (cells[cellIndex].innerHTML !== "") return "Can't change current cell";
    cells[cellIndex].innerHTML = mark;
  };
  const clearCells = () => {
    for (const c of cells) {
      c.innerHTML = "";
    }
  };
  async function changeCellColor(cellIndexes, color) {
    for (const index of cellIndexes) {
      cells[index].style.background = color;
    }
    // After a wait of 2 seconds, reset the color back to normal
    await sleep(2000);

    for (const index of cellIndexes) {
      cells[index].style.background = "black";
    }
  }
  const changeWinnerText = (txt) => {
    const textField = document.querySelector("#winner-text");
    textField.innerText = txt;
  };
  return { changeCell, clearCells, changeCellColor, changeWinnerText };
})();

const game = (() => {
  let lastPlay = "o";
  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const preventClick = () => {
    document.addEventListener("pointerdown", handlePointerDown, true);
  };
  const allowClick = () => {
    document.removeEventListener("pointerdown", handlePointerDown, true);
  };
  const resetRoundOnTie = async () => {
    // Do not allow clicks when won
    preventClick();
    // Reset last play so it doesn't get O as player 1
    lastPlay = "o";
    // Make all cells a certain color when there is a tie
    await displayController.changeCellColor(
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      "orange",
    );
    // Change text to TIE
    displayController.changeWinnerText("Game was a TIE!");
    gameboard.resetBoard();
    displayController.clearCells();
    // Allow clicks again
    allowClick();
  };
  const resetRoundOnWin = async (winner) => {
    // Do not allow clicks when won
    preventClick();
    // Change the cells that won to green, it await for it to go
    await displayController.changeCellColor(
      gameboard.getLastWinningCombination(),
      "green",
    );
    lastPlay = "o";
    gameboard.resetBoard();
    displayController.clearCells();
    displayController.changeWinnerText(
      `${winner.getMark().toUpperCase()} is the winner!
      Now you have ${winner.getScore()} points!`,
    );
    // Allow clicks again
    allowClick();
  };
  const newGame = async (winner) => {
    winner.increaseScore();
    resetRoundOnWin(winner);
    // console.log(  `${winner.getName()} is the winner of the round!, now you have ${winner.getScore()} points`, );
  };
  const playRound = (cellClicked) => {
    if (lastPlay === "o") {
      // if this returns true, it will be a win
      if (gameboard.changeBoardArrayLayout(playerOne.getMark(), cellClicked)) {
        // Call the function even if you won, so you get to see the wining combination
        displayController.changeCell(cellClicked, playerOne.getMark());
        newGame(playerOne);
        return;
      } else {
        // This else statement is if noone won.
        displayController.changeCell(cellClicked, playerOne.getMark());
        lastPlay = playerOne.getMark();
        return;
      }
    } else if (lastPlay === "x") {
      // if this returns true, it will be a win
      if (gameboard.changeBoardArrayLayout(playerTwo.getMark(), cellClicked)) {
        // Call the function even if you won, so you get to see the wining combination
        displayController.changeCell(cellClicked, playerTwo.getMark());
        newGame(playerTwo);
        return;
      } else {
        // This else statement is if noone won.
        displayController.changeCell(cellClicked, playerTwo.getMark());
        lastPlay = playerTwo.getMark();
        return;
      }
    }
    // This part of the code will not be reached
  };
  const cellsContainer = document.querySelector("#cells-container");
  const cells = cellsContainer.children;
  // Add each cell event listener
  for (const c of cells) {
    // Call the function with the cell id of the cell clicked
    c.addEventListener("pointerdown", () => {
      // if this returns true there is a tie, so reset everything
      if (c.innerHTML !== "")
        // only if there isnt a mark already
        return;
      playRound(Number(c.id));
      if (gameboard.checkTie()) resetRoundOnTie();
    });
  }
  return { playRound };
})();
