import './charList.scss';
import { Component } from 'react';

import MarvelService from '../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from "../spinner/Spinner";

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

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }
    
    componentDidMount() {
        this.MarvelService
            .getAllCharacters()
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }

    onRenderItems = (arr) => {
        const cards = arr.map((item) => {
            

            let classNames = "char__img";
            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                classNames+= " notFound";
            }

            return (
                <li 
                    className="char__item"
                    key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}>
                        <img src={item.thumbnail} alt={item.name} className={classNames}/>
                        <div className="char__name">{item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {cards}     
            </ul>
        )
    }

    render() {
        const {data, loading, error} = this.state;
        const items = this.onRenderItems(data);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}