import React, {Component} from 'react'
import gameLogic from '../helper/gameLogic'
import Controller from '../helper/Controller'
import './scoreboard.css';


class Scoreboard extends Component {
    constructor() {
        super();
        this.game = gameLogic.createGame();
        this.state = {
            currScore: this.game.score(),
            inputScore: '0',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //handles the input form and submissions
    handleChange = (event) => {
        this.setState({ inputScore: event.target.value })
    }

    //overall, i'd like to try more tests on this to see what breaks it
    handleSubmit = (event) => {
        let x = this.state.inputScore;

        if (x === "Strike") {
            x = 10;
        }

        //this part's a bit buggy...if you don't input the first frame it'll calculate a strike instead of a spare
        //sort of a failure in input sanitation
        //can be remedied by checking the input stream properly
        if (x === "Spare") {
            x = this.game.pinsLeft()
        }

        if (x === "Miss") {
            x = 0;
        }
        if (x > this.game.pinsLeft() || x < 0 || x > 10 || isNaN(x)) {
            alert("INVALID SCORE");
            this.setState({ currScore: this.game.score() })
        }
        else {
            //updates the game state
            this.game.roll(x);
            this.setState({ currScore: this.game.score() })
        }
        
        event.target.reset();
        event.preventDefault()
    }

    //helper functions
    resetGame = () => {
        this.game.resetGame();
        this.setState({ currScore: this.game.score() })
    }

    
    pinsLeft = () => this.game.pinsLeft();


    render() {
        const { currScore } = this.state;
        const elements = [...Array(10)];
        return (
            <div>
                <div className="space"/>
            <div>
                <Controller
                    handleSubmit = {this.handleSubmit}
                    handleChange = {this.handleChange}
                    handleReset = {this.resetGame}
                />
            </div>
            <div className="space"/>
            <div>
              <table className="score-board">
                {elements.map((x, i) => {
                    return (
                        <div className="frame">
                            
                            <div className="frame-score">
                                <h2>{i + 1}</h2>
                                <div className="box">{currScore[i].firstScore}</div>
                                <div className="box">{currScore[i].secondScore}</div>
                                <div className="box extra">{currScore[i].thirdScore}</div>
                            </div>
                            <div className="running-score">{!isNaN(currScore[i].totalScore) && currScore[i].totalScore}</div>
                        </div>
                    )
                })} 
            </table>
            </div>
    </div>
        )
    }
}

export default Scoreboard