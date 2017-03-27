import React from "react";
import { Alert } from "react-bootstrap";

export default class ResponseAlert extends React.Component {
    static propTyps = {
        show: React.PropTypes.bool,
        error: React.PropTypes.bool,
        lastEntry: React.PropTypes.string,
        errorMsg: React.PropTypes.string
    };

    render() {
        const { show, error, lastEntry, errorMsg} = this.props;

        if (!show) {
            return null;
        }

        return (
            <Alert bsStyle={error ? "danger" : "success"}>
              <strong>{error ? "Error! " : "Success! "}</strong>
              { error ?
                  `The entry ${lastEntry} couln't be saved.` :
                  `The entry ${lastEntry} was saved.`
              }
              <br></br>
              {errorMsg}
            </Alert>
        );
    }
}
