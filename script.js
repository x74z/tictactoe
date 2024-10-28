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

  const changeBoardLayout = (mark, position) => {
    // Changes the layout while also looking for winners
    boardLayout[position] = mark;
    // maybe do this outside of here? TODO ?
    return checkWinner();
  };
  const resetBoard = () => {
    boardLayout = initialBoardLayout;
  };
  return { getLayout, changeBoardLayout, checkWinner, resetBoard };
})();

// const displayController = (() => {
//   let a = "add code";
//   return { a };
// })();

const createPlayer = (playerName, playerMark) => {
  const name = playerName;
  const mark = playerMark;
  let score = 0;
  const getPlayerName = () => name;

  const getPlayerMark = () => mark;

  const getPlayerScore = () => score;

  const increasePlayerScore = () => score++;

  return { getPlayerName, getPlayerMark, getPlayerScore, increasePlayerScore };
};
const playerOne = createPlayer(prompt("Enter player x name: "), "x");
const playerTwo = createPlayer(prompt("Enter player o name: "), "o");
const game = (() => {
  const newGame = (winner) => {
    gameboard.resetBoard();
    console.log(`${winner} is the winner of the round!`)
  };
  let lastPlay = "o";
  const playRound = () => {
    if (lastPlay === "o") {
      // if this returns true, it will be a win
      if (gameboard.changeBoardLayout("x", prompt("Player x: Enter array index: "))) {
        playerOne.increasePlayerScore();
        newGame(playerOne.getPlayerName());
        return;
      } else {
        lastPlay = "x";
      }
    } else {
      // if this returns true, it will be a win
      if (gameboard.changeBoardLayout("o", prompt("Player o: Enter array index: "))) {
        playerTwo.increasePlayerScore();
        newGame(playerTwo.getPlayerName());
        return;
      } else {
        lastPlay = "o";
      }
    }
  };
  return { playRound };
})();
