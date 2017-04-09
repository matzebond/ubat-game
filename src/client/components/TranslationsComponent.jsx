import React from "react";
import { Button } from "react-bootstrap";
import Select from 'react-select';

import 'react-select/dist/react-select.css';

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
            curLang: props.langs[0],
            translations: []
        };

        this.addTranslation = this.addTranslation.bind(this);
        this.removeTranslation = this.removeTranslation.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleLangChange = this.handleLangChange.bind(this);
        this.translationRow = this.translationRow.bind(this);
    }

    addTranslation() {
        this.setState(({ translations, curText, curLang }) => {
            const newTranslation = new Translation({text: curText, lang: curLang});
            translations.push(newTranslation);

            this.props.onTranslationChange(translations);

            return {translations, curText: "", curLang: ""};
        });
    }

    removeTranslation(index) {
        this.setState(({ translations }) => {
            translations.splice(index, 1);
            return { translations };
        });
    }

    handleTextChange(e) {
        this.setState({ curText: e.target.value });
    }

    handleLangChange(lang) {
        this.setState({ curLang: lang.value });
    }

    translationRow({text, lang}, index) {
        return (
            <div>
              <p className="translations-lang">{lang}</p>
              <input className="translations-input form-control input" value={text} />
              <Button bsStyle="danger" onClick={this.removeTranslation.bind(this, index)}>x</Button>
            </div>
        );
    }

    render() {
        const { translations, curText, curLang } = this.state;
        const { langs } = this.props;

        const translationRows = translations.map(this.translationRow);

        const translatedLangs = translations.map(trans => trans.lang);
        const remainLangs = langs.filter(lang => !translatedLangs.includes(lang));

        const langOptions = langs.map(lang => {
            return {value: lang, label: lang, disabled: translatedLangs.includes(lang)};
        });

        return (
            <div>
              <span>Translations:</span>
              {translationRows}
              <div>
                <Select className="translation-lang-select"
                  value={curLang}
                  options={langOptions}
                  onChange={this.handleLangChange}
                  clearable={false}
                  />
                <input className="translation-input form-control input"
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

