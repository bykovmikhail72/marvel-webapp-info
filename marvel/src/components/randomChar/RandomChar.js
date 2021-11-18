import {Component} from "react"

import MarvelService from "../services/MarvelService";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    state = {
        name: null,
        descr: null,
        thumbnail: null,
        homepage: null,
        wiki: null
    }

    MarvelService = new MarvelService();

    updateChar = () => {
        const id = 1009144;
        this.MarvelService
            .getCharacters(id)
            .then(res => {
                const result = res.data.results[0];
                this.setState({
                    name: result.name,
                    descr: result.description,
                    thumbnail: result.thumbnail.path + '.' + result.thumbnail.extension,
                    homepage: result.urls[0].url,
                    wiki: result.urls[1].url
                })
            })
    }

    render() {
        const {name, descr, thumbnail, homepage, wiki} = this.state;

        return (
            <div className="randomchar">
                <div className="randomchar__block">
                    <img src={thumbnail} alt="Random character" className="randomchar__img"/>
                    <div className="randomchar__info">
                        <p className="randomchar__name">{name}</p>
                        <p className="randomchar__descr">
                            {descr}
                        </p>
                        <div className="randomchar__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button 
                        className="button button__main"
                        onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

export default RandomChar;