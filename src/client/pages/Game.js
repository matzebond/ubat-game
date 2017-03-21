import React from "react";
import { observer } from "mobx-react";
import { Button, ProgressBar, Well} from "react-bootstrap";

import EntryStore from "../EntryStore";

import "./game.css";

const successAudio = new Audio("/assets/success.mp3");
const failureAudio = new Audio("/assets/failure.mp3");



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

function triggerAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

const updateTime = 200;
const minGestureTime = 1000;
const thresholdAccX = 2;
const thresholdAccY = 1.6;
const thresholdRotA = 150;
const thresholdRotB = 80;

@observer
export default class Game extends React.Component {
    static defaultProps = {
        gameLength: 120000
    }

    constructor(props) {
        super(props);

        this.renderGame = this.renderGame.bind(this);
        this.handleMotionChange = this.handleMotionChange.bind(this);
        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.solveEntry = this.solveEntry.bind(this);
        this.skipEntry = this.skipEntry.bind(this);
        this.nextEntry = this.nextEntry.bind(this);

        this.state = {
            progress: 40,
            lastTime: Date.now(),
            gameState: 'new'
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
        // this.addListeners();
    }

    componentWillUnmount() {
        // this.removeListeners();
        clearInterval(this.intervalID);
    }

    addListeners() {
        if (window && window.DeviceMotionEvent) {
            this.motionListener = this.handleMotionChange;
            window.addEventListener('devicemotion', this.motionListener, false);
        }
    }

    removeListeners() {
        if (window) {
            window.removeEventListener('devicemotion', this.motionListener, false);
        }
    }

    startGame() {
        if (this.state.gameState == 'playing') {
            return;
        }

        this.tags = shuffle(EntryStore.currentGameEntries);

        this.setState({
            gameState: 'playing',
            progress: 0,
            solved: 0,
            skipped: 0,
            currentEntry: "",
            gameStart: Date.now()
        });

        this.nextEntry(true);
        this.addListeners();
        this.startTimer();
    }

    startTimer() {
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
    }

    stopTimer() {
        clearInterval(this.intervalID);
    }

    endGame() {
        const gameEnd = Date.now();

        this.stopTimer();
        this.removeListeners();
        this.setState((prevState) => { return {
            gameState: 'finished',
            progress: 0,
            gameTime: gameEnd - prevState.gameStart
        }});
    }

    solveEntry() {
        triggerAudio(successAudio);
        this.setState(prev => {return {solved: ++prev.solved};});
        this.nextEntry();
    }

    skipEntry() {
        triggerAudio(failureAudio);
        this.setState(prev => {return {skipped: ++prev.skipped};});
        this.nextEntry();
    }

    nextEntry(force) {
        if (this.state.gameState != 'playing' && !force) return;


        if (this.tags.length <= 0) {
            this.endGame();
        }
        const nextEntry = this.tags.shift();
        this.setState({
            currentEntry: nextEntry
        });
    }

    handleMotionChange(event) {
        this.xA = event.acceleration.x || 0;
        this.yA = event.acceleration.y || 0;
        this.zA = event.acceleration.z || 0;
        this.xG = event.accelerationIncludingGravity.x || 0;
        this.yG = event.accelerationIncludingGravity.y || 0;
        this.zG = event.accelerationIncludingGravity.z || 0;
        this.aR = event.rotationRate.alpha || 0;
        this.bR = event.rotationRate.beta || 0;
        this.gR = event.rotationRate.gamma || 0;
        this.interval = event.interval || 0;

        const timestamp = event.timestamp;

        if (event.acceleration && event.accelerationIncludingGravity && event.rotationRate && event.interval) {
            this.supported = true;
        }

        let currentTime = Date.now();
        const timeDiff = currentTime - this.state.lastTime;

        if (Math.abs(this.xA) - Math.abs(this.yA) >= thresholdAccX && timeDiff >= minGestureTime) {
            this.solveEntry();
            this.setState({
                lastTime : currentTime
            });
        }
        else if ((Math.abs(this.yA) - Math.abs(this.xA) >= thresholdAccY || Math.abs(this.aR) >= thresholdRotA)&& timeDiff >= minGestureTime) {
            this.skipEntry();
            this.setState({
                lastTime : currentTime
            });
        }

        // if (timeDiff >= minGestureTime) {
        //     this.setState({
        //         lastTime : currentTime
        //     });
        // }
    }

    renderGame() {
        const {gameState, currentEntry, progress, gameTime, skipped, solved} = this.state;
        const tag = EntryStore.currentGameTag;
        const entryCount = solved + skipped;
        const solvedPct = (solved / entryCount * 100).toFixed(0);
        const gameSeconds = (gameTime / 1000).toFixed(1);

        switch(gameState) {
        case "playing":
            return (<div>
                        <h1>{currentEntry.text}</h1>
                        <Button bsStyle="success" bsSize="large" className="game-btn-solve" onClick={this.solveEntry}>solved</Button>
                        <Button bsStyle="warning" bsSize="large" className="game-btn-skip" onClick={this.skipEntry}>skip</Button>
                        <p style={{textAlign: "center"}}>{`Solved: ${solved}, Skipped: ${skipped}`}</p>
                        <ProgressBar active now={progress} />
                    </div>);

        case "finished":
            return (<div>
                        <h2>{`In ${gameSeconds}s you solved ${solved}`}</h2>
                        <h1 className="huge">{`${solvedPct}%`}</h1>
                        <h3>{`Replay the tag "${tag.text}"?`}</h3>
                        <Button bsStyle="primary" bsSize="large" block onClick={() => this.startGame()}>Play Again</Button>
                    </div>);

        case "new":
        default:
            return (<div>
                        <h1>{`Start playing the tag "${tag.text}"`}</h1>
                        <Button bsStyle="primary" bsSize="large" block onClick={() => this.startGame()}> Start Game </Button>
                    </div>);

        }
    }

    render() {
        const { progress, gameState, currentEntry, solved, skipped} = this.state;
        const tag = EntryStore.currentGameTag;

        const progressStyles = { position: "absolute", bottom: 0, left: "1em", right: "1em" };

        return (
            <div>
                <Well className="game-well">
                {this.renderGame()}
                </Well>
            </div>
        );
    }
}
