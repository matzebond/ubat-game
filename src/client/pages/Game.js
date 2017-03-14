import React from "react";
import { observer } from "mobx-react";
import { Button, ProgressBar, Well} from "react-bootstrap";

import EntryStore from "../EntryStore";

import "./game.css";

/**
 * Fisher-Yates Shuffle
 * @param {Array} a items The array containing the items.
 * @return {Array} shuffled array
 */
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

@observer
export default class Game extends React.Component {

    static defaultProps = {
        gameLength: 60000
    }

    constructor(props) {
        super(props);

        this.handleMotionChange = this.handleMotionChange.bind(this);
        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.solveEntry = this.solveEntry.bind(this);
        this.skipEntry = this.skipEntry.bind(this);
        this.nextEntry = this.nextEntry.bind(this);

        this.state = {
            progress: 40,
            lastTime: new Date(),
            gameStated: false
        };

        let tagID = this.props.match.params.id;
        let tag = EntryStore.tags.filter(tag => tag.id == tagID)[0];

        if (!tag) {
            tagID = Math.floor(Math.random() * EntryStore.tags.length );
            tag = EntryStore.tags[tagID];
        }

        EntryStore.setCurrentGameTag(tag);
    }

    componentWillMount() {
        if (window && window.DeviceMotionEvent) {
            this.motionListener2 = this.handleMotionChange;
            window.addEventListener('devicemotion', this.motionListener2, false);
        }
    }

    componentWillUnmount() {
        if (window) {
            window.removeEventListener('devicemotion', this.motionListener2, false);
        }
        clearInterval(this.intervalID);
    }

    startGame() {
        console.log("Start Game");
        this.tags = shuffle(EntryStore.currentGameEntries);
        const updateTime = 200;

        this.setState({
            gameStated: true,
            progress: 0,
            solved: 0,
            skipped: 0,
            currentEntry: ""
        });

        this.intervalID = setInterval(() => {
            if (this.state.progress >= 100) {
                this.endGame();
            }
            this.setState((prevState) => {
                return {
                    progress: prevState.progress + (updateTime * 100 / this.props.gameLength)
                };
            });
        }, updateTime);

        this.nextEntry();
    }

    endGame() {
        clearInterval(this.intervalID);
        this.setState({
            gameStated: false,
            progress: 0
        });
    }

    solveEntry() {
        this.setState(prev => {return {solved: ++prev.solved};});
        this.nextEntry();

    }

    skipEntry() {
        this.setState(prev => {return {skipped: ++prev.skipped};});
        this.nextEntry();
    }

    nextEntry() {
        if (this.tags.length <= 0) {
            this.endGame();
        }
        const nextEntry = this.tags.shift();
        this.setState({
            currentEntry: nextEntry
        });
    }

    handleMotionChange(event) {
        this.xA = event.acceleration.x | 0;
        this.yA = event.acceleration.y | 0;
        this.zA = event.acceleration.z | 0;
        this.xG = event.accelerationIncludingGravity.x | 0;
        this.yG = event.accelerationIncludingGravity.y | 0;
        this.zG = event.accelerationIncludingGravity.z | 0;
        this.aR = event.rotationRate.alpha | 0;
        this.bR = event.rotationRate.beta | 0;
        this.gR = event.rotationRate.gamma | 0;
        this.interval = event.interval | 0;

        const timestamp = event.timestamp;

        if (event.acceleration && event.accelerationIncludingGravity && event.rotationRate && event.interval) {
            this.supported = true;
        }

        let currentTime = new Date();
        const timeDiff = currentTime.getTime() - this.state.lastTime.getTime();

        if (timeDiff > 1000) {
            this.setState({
                lastTime : currentTime
            });
        }
    }

    render() {
        const { progress, gameStated, currentEntry, solved, skipped} = this.state;
        const tag = EntryStore.currentGameTag;

        const progressStyles = { position: "absolute", bottom: 0, left: "1em", right: "1em" };

        return (
            <div>
                <Well className="game-well">
                {!gameStated ?
                 <div>
                    <h1>{`You are playing the tag "${tag.text}"`}</h1>
                    <Button bsStyle="primary" bsSize="large" block onClick={() => this.startGame()}>
                    Start Game
                    </Button>
                 </div>
                 :
                 <div>
                    <h1>{currentEntry.text}</h1>
                    <Button bsStyle="success" bsSize="large" className="game-btn-solve" onClick={this.solveEntry}>solved</Button>
                    <Button bsStyle="warning" bsSize="large" className="game-btn-skip" onClick={this.skipEntry}>skip</Button>
                 <p style={{textAlign: "center"}}>{`Solved: ${solved}, Skipped: ${skipped}`}</p>
                    <ProgressBar active now={progress} />
                 </div>
                }
                </Well>
                <ul>
                    <li><strong>Acceleration:</strong> {this.xA} {this.yA} {this.zA}</li>
                    <li><strong>Acceleration including gravity:</strong> {this.xG} {this.yG} {this.zG}</li>
                    <li><strong>Rotation rate:</strong> {this.aR} {this.bR} {this.gR}</li>
                    <li><strong>Interval:</strong> {this.interval}</li>
                </ul>
            </div>
        );
    }
}
