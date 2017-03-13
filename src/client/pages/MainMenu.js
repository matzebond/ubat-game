import React from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Well } from "react-bootstrap";

export default class MainMenu extends React.Component {
    render () {
        return (
            <Well>
                <h2>Main Menu</h2>
            <ButtonGroup vertical block>
                <Link to="/game"><Button bsSize="large" block>Start Game</Button></Link>
                <Link to="/content"><Button bsSize="large" block>Edit Content</Button></Link>
            </ButtonGroup>
                </Well>
        );
    }
}
