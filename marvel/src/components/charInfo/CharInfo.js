import { Component } from 'react';

import MarvelService from '../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import Skeleton from "../skeleton/Skeleton"

import './charInfo.scss';

export default class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    MarvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const {id} = this.props;
        if (!id) {
            return;
        } 

        this.onCharLoading();

        this.MarvelService
            .getCharacters(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    render() {
        const {char, loading, error} = this.state;
        

        const skeleton = char || loading || error ? null : <Skeleton/>
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {errorMessage}
                {spinner}
                {content}
                {skeleton}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, thumbnail, homepage, wiki, descr, comics} = char;

    let imgStyle = {"objectFit" : "cover"};
    if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = {"objectFit" : "contain"};
    }

    const emptyComics = comics.length === 0 ? "There are not any comics with this character" : null;

    const comicsItem = comics.map((item, i) => {
        return (
            <li className="char__comics-item" key={i}><a href={item.resourceURI}>
                {item.name}
            </a></li>
        )
    })

   return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {descr ? descr : "Sorry, nothing was found about this character"}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsItem}
                {emptyComics}
            </ul>
        </>
   )
}