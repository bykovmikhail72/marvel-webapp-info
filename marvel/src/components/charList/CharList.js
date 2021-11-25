import './charList.scss';
import { Component } from 'react';

import MarvelService from '../services/MarvelService';

export default class CharList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            error: false
        }
    }

    MarvelService = new MarvelService();

    onCharsLoaded = (char) => {
        this.setState({
            data: char,
            loading: false
        });
    }

    updateChars = () => {
        this.MarvelService
        .getAllCharacters()
        .then(this.onCharsLoaded)
    }
    
    componentDidMount() {
        this.updateChars();
    }



    render() {
        const {data} = this.state;

        const cards = data.map(({name, thumbnail, id, resourceURI}) => {
            const url = thumbnail.path + '.' + thumbnail.extension;

            let classNames = "char__img";
            if (url === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                classNames+= " notFound";
            }

            return (
                <li 
                    className="char__item"
                    key={id}
                    onClick={this.onLinkChar}>
                <a href={resourceURI}>
                    <img src={url} alt={name} className={classNames}/>
                    <div className="char__name">{name.length > 20 ? `${name.slice(0, 20)}...` : name}</div>
                </a></li>
            )
        })

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {cards}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}