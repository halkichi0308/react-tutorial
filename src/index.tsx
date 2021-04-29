import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface SquareProps {
  value: 'X'|'O'|null,
  onClick: ()=>void
}

function Square(props: SquareProps){
  return (
    <button className="square" onClick={props.onClick} >
      {props.value}
    </button> 
  )
}

interface BoardProps {
  squares: Array<'X'|'O'|null>,
  onClick: (i: number)=>void
}
function Board(props: BoardProps){
  const renderSquare = (i: number) =>{
    return (
      <Square
        value={props.squares[i]}
        onClick={()=> props.onClick(i)}
      />
      )
  }
  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );


}

type History = {
  squares: Array<'X'|'O'|null>
}
interface GameState {
  history: History[],
  stepNumber: number,
  xIsNext: Boolean
}
//親Component
// React.Componentの引数は1つめがprops, 2つ目がStateの型
class Game extends React.Component<{}, GameState> {
  constructor(props: {}){
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }
  handleClick(i: number){
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if(calculateWinner(squares)||squares[i]){
      return 
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }
  jumpTo(step: number){
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0
    })
  }
  render(){
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move :
        'Go to game Start';
      const style = {
        fontSize: history.length -1 === move ? "120%" : "100%"
      }
      return (
        <li key={move}>
          <button 
            onClick={()=> this.jumpTo(move)}
            style={style}
          >{desc}</button>
        </li>
      )
    })
    let status
    if (winner){
      status = 'winner: ' + winner
    } else {
      status = 'next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }
    return (
      <div className="game">
      <div className="game-board">
        <Board 
          squares={current.squares}
          onClick={i => this.handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
    )
  }
}




// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares:Array<'X'|'O'|null>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
