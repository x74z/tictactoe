const gameboard = (() => {
  let boardLayout = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const initialBoardLayout = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const getLayout = () => boardLayout;
  const checkWinningCombinations = (arr) => {
    // The function receives an array and checks wether that array is a winner
    if (
      boardLayout[arr[0]] === boardLayout[arr[1]] &&
      boardLayout[arr[1]] === boardLayout[arr[2]]
    ) {
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

  const changeLayout = (mark, position) => {
    // Changes the layout while also looking for winners
    boardLayout[position] = mark;
    // maybe do this outside of here? TODO ?
    return checkWinner();
  };
  const resetBoard = () => {
    boardLayout = initialBoardLayout;
  };
  return { getLayout, changeLayout, checkWinner, resetBoard };
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
const playerOne = createPlayer("player1.", "x")
const playerTwo = createPlayer("playerx.", "o")

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
    cells[cellIndex].innerHTML = mark;
  };
  const clearCells = () => {
    for (const c of cells) {
      c.innerHTML = "";
    }
  };
  return { changeCell, clearCells };
})();

const game = (() => {
  const newGame = (winner) => {
    gameboard.resetBoard();
    displayController.clearCells();
    winner.increaseScore();
    console.log(`${winner.getName()} is the winner of the round!, now you have ${winner.getScore()} points`);
  };
  let lastPlay = "o";
  const playRound = (cellClicked) => {
    if (lastPlay === "o") {
      // if this returns true, it will be a win
      if (gameboard.changeLayout(playerOne.getMark(), cellClicked)) {
        newGame(playerOne);
        return;
      } else {
        // This else statement is if noone won.
        displayController.changeCell(cellClicked, playerOne.getMark());
        lastPlay = playerOne.getMark();
      }
    } else if (lastPlay === "x") {
      // if this returns true, it will be a win
      if (gameboard.changeLayout(playerTwo.getMark(), cellClicked)) {
        newGame(playerTwo);
        return;
      } else {
        // This else statement is if noone won.
        displayController.changeCell(cellClicked, playerTwo.getMark());
        lastPlay = playerTwo.getMark();
      }
    }
  };
  const cellsContainer = document.querySelector("#cells-container");
  const cells = cellsContainer.children;
  // Add each cell event listener
  for (const c of cells) {
    // Call the function with the cell id of the cell clicked
    c.addEventListener("click", () => {
      playRound(Number(c.id));
    });
  }
  return { playRound };
})();
