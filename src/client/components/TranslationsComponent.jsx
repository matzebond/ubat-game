import React from "react";
import { Button } from "react-bootstrap";

import Translation from "../../data/Translation.js";

export default class Translations extends React.Component {
    static propsTyps = {
        langs: React.PropTypes.arrayOf(React.PropTypes.string),
        onTranslationChange: React.PropTypes.func
    };

    static defaultProps = {
        langs: [ "German", "French", "Spanish", "Russian", "Ukrainian", "Turkish" ]
    };

    constructor(props) {
        super(props);

        this.state = {
            curText: "",
            curLang: "",
            translations: [new Translation({text:"dummyTrans", lang:"German"})]
        };

        this.addTranslation = this.addTranslation.bind(this);
        this.removeTranslation = this.removeTranslation.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.translationRow = this.translationRow.bind(this);
    }

    handleTextChange(e) {
        this.setState({curText: e.target.value});
    }

    addTranslation() {
        this.setState(({ translations, curText, curLang }) => {
            const newTranslation = new Translation({text: curText, lang: curLang});
            const newTranslations = translations.push(newTranslation);

            this.props.onTranslationChange(newTranslations);

            return {tranlations: newTranslations, curText: "", curLang: ""};
        });
    }

    removeTranslation(index) {
        this.setState(({ translations }) => {
            translations.splice(index, 1);
            return { translations };
        });
    }

    translationRow({text, lang}, index) {
        return (
            <div>
              <p>{lang}</p>
              <input value={text} />
              <Button bsStyle="danger" onClick={this.removeTranslation.bind(index)}>x</Button>
            </div>
        );
    }

    render() {
        const { translations, curText, curLang } = this.state;
        const { langs } = this.props;

        console.log("render");

        const translationRows = translations.map(this.translationRow);

        const translatedLangs = translations.map(({lang}) => lang);


        return (
            <div>
              <span>Translations:</span>
              {translationRows}
              <div>
                <p>{curLang}</p>
                <input className="form-control input"
                  value={curText}
                  onChange={this.handleTextChange}
                  placeholder="Enter translation"
                  />
                <Button bsStyle="success" onClick={this.addTranslation}>Add</Button>
              </div>
            </div>
        );
    }
}

