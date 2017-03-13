import React from "react";
import { observer } from "mobx-react";
import { Button, ProgressBar } from "react-bootstrap";

import EntryStore from "../EntryStore";


@observer
export default class Game extends React.Component {

    static defaultProps = {
        gameLength: 30000
    }

    constructor(props) {
        super(props);

        this.state = {
            progress: 40,
            lastTime: new Date(),
            gameStated: false
        };

        let tagID = this.props.match.params.id;
        this.tag = EntryStore.tags.filter(tag => tag.id == tagID)[0];

        if (!this.tag) {
            tagID = Math.floor(Math.random() * EntryStore.tags.length );
            this.tag = EntryStore.tags[tagID];
        }

        console.log(tagID, this.tag.text);

        this.handleMotionChange = this.handleMotionChange.bind(this);
        this.startGame = this.startGame.bind(this);
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
    }

    startGame() {
        console.log("Start Game");
        const updateTime = 200;

        this.setState({
            gameStated: true,
            progress: 0
        });

        this.intervalID = setInterval(() => {
            if (this.state.progress >= 100) {
                endGame();
            }
            this.setState((prevState) => {
                return {
                    progress: prevState.progress + (updateTime * 100 / this.props.gameLength)
                };
            });
        }, updateTime);
    }

    endGame() {
        this.setState({
            gameStated: false,
            progress: 0
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
        const { progress, gameStated} = this.state;

        const wellStyles = { height: 400, margin: '0 auto 10px', position: "relative" };
        const progressStyles = { position: "absolute", bottom: 0, left: "1em", right: "1em" };

        return (
            <div>
                <div className="well" style={wellStyles}>
                {!gameStated ?
                 <div>
                    <h1>{`You are playing the tag "${this.tag.text}"`}</h1>
                    <Button bsStyle="primary" bsSize="large" block onClick={() => this.startGame()}>
                    Start Game
                    </Button>
                 </div>
                 :
                 <ProgressBar active={this.state.gameStated} now={progress} />
                }
                </div>
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
