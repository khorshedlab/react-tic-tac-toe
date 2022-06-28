import { useEffect, useState } from "react";
import Grid from "./Grid";
import "./App.scss";

function isSuperset(set, subset) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

//wining index
const sets = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

const initialGrid = new Array(9).fill().map((item, i) => {
  return { id: i + 1, player: "" };
});

export default function App() {
  //Page Routing
  const [page, setPage] = useState("home");
  //Playing mood in future I will implement ai so only one player can play that is why this is necessary
  const [mood, setMood] = useState("");
  const [grid, setGrid] = useState(initialGrid);
  const [turn, setTurn] = useState("");
  const [winner, setWinner] = useState("");
  const [player1Grid, setPlayer1Grid] = useState([]);
  const [player2Grid, setPlayer2Grid] = useState([]);
  const [identity, setIdentity] = useState({ player1: "", player2: "" });

  //If Computer turn is first ,select first move
  useEffect(() => {
    if (turn === "player2" && mood === "computer") {
      firstAiMove();
      console.log("mood");
    }
  }, [mood]);

  //Run Ai Move whenever ist turn

  useEffect(() => {
    if (turn === "player2" && mood === "computer") {
      runAi();
    }
  }, [player1Grid]);

  //This useEffect check for win in every move
  useEffect(() => {
    checkIsWin(player1Grid, "Player1");
    checkIsWin(player2Grid, mood);
  }, [player1Grid, player2Grid]);

  const setPlayer = (player) => {
    setPage("game");
    setMood(player);
    setIdentityFunc();
  };
  //this function is use to set randomize x & o
  const setIdentityFunc = () => {
    let ranId = Math.random() * 10 > 5 ? "❌" : "⭕";
    setIdentity({ player1: ranId, player2: ranId === "❌" ? "⭕" : "❌" });
    setTurn(ranId === "❌" ? "player1" : "player2");
  };

  const setSelection = (id) => {
    if (turn === "player2" && mood === "computer") return;
    const newArr = grid.map((i) => {
      if (i.id === id) {
        return { ...i, player: turn };
      } else return i;
    });
    setGrid(newArr);
    setPlayerGrid(id, turn);

    setTurn(turn === "player1" ? "player2" : "player1");
  };
  const setPlayerGrid = (id, turn) => {
    if (turn === "player1") {
      setPlayer1Grid([...player1Grid, id]);
    } else {
      setPlayer2Grid([...player2Grid, id]);
    }
  };

  //This function check if win or draw

  const checkIsWin = (grid, user) => {
    sets.map((i) => {
      const setA = new Set(grid);
      const setB = new Set(i);
      if (isSuperset(setA, setB)) {
        setWinner(user);
        setPage("notice");
      } else {
        const arr = [...player1Grid, ...player2Grid];
        if (arr.length === 9) {
          setWinner("Match Draw!");
          setPage("notice");
        }
      }
    });
  };

  const resetGame = () => {
    setPage("home");
    setMood("");
    setGrid(initialGrid);
    setTurn("");
    setWinner("");
    setPlayer1Grid([]);
    setPlayer2Grid([]);
    setIdentity({ player1: "", player2: "" });
  };

  const runAi = () => {
    const arr = [...player1Grid, ...player2Grid];
    if (arr.length === 9) {
      return;
    }
    //checking which grid are empty
    const filledArr = [...player1Grid, ...player2Grid];
    const emptyGrid = grid.filter((x) => !filledArr.includes(x.id));
    const id = emptyGrid[Math.floor(Math.random() * emptyGrid.length)].id;
    console.log(emptyGrid);
    console.log(id);
    const newArr = grid.map((i) => {
      if (i.id === id) {
        return { ...i, player: turn };
      } else return i;
    });
    setGrid(newArr);
    setPlayerGrid(id, turn);
    setTurn(turn === "player1" ? "player2" : "player1");
  };

  const firstAiMove = () => {
    let id = Math.floor(Math.random() * 9 + 1);
    const newArr = grid.map((i) => {
      if (i.id === id) {
        return { ...i, player: turn };
      } else return i;
    });
    setGrid(newArr);
    setPlayerGrid(id, turn);
    setTurn(turn === "player1" ? "player2" : "player1");
  };

  return (
    <div className="app">
      <div className="app__container">
        {page === "home" && (
          <div className="home">
            <h1 className="home__title">✨Tic Tac Toe🎉</h1>
            <h4 className="home__subtitle">Select Player Mode</h4>
            <div className="home__btn-container">
              <button
                onClick={() => setPlayer("player2")}
                className="home__btn"
              >
                2 Player
              </button>
              <button
                onClick={() => setPlayer("computer")}
                className="home__btn"
              >
                You vs Computer
              </button>
            </div>
          </div>
        )}
        {page === "game" && (
          <div className="game">
            <h1 className="home__title">✨Tic Tac Toe🎉</h1>
            <div className="game__player-container">
              <p
                className={`game__player ${
                  turn === "player1" ? "game__player--active" : null
                }`}
              >
                Player1 <span>{identity.player1}</span>
              </p>
              <p
                className={`game__player ${
                  turn === "player2" ? "game__player--active" : null
                }`}
              >
                {mood} <span>{identity.player2}</span>
              </p>
            </div>
            <div className="game__grid-container">
              {/* =========================================== */}
              {grid.map((i) => {
                return (
                  <Grid
                    props={{
                      setSelection,
                      player: identity,
                      i: i,
                    }}
                    key={i.id}
                  />
                );
              })}
              {/* =========================================== */}
            </div>
          </div>
        )}
        {page === "notice" && (
          <div className="notice">
            <h1 className="home__title home__title--notice">
              {winner === "Match Draw!" ? winner : `${winner} Win!`}
            </h1>
            <div className="notice__btn-container">
              <button onClick={resetGame} className="notice__btn">
                Home
              </button>
              <button className="notice__btn">Play Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
