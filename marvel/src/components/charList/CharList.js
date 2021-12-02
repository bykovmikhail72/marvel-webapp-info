import './charList.scss';
import { Component } from 'react';
import PropTypes from "prop-types";

import MarvelService from '../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from "../spinner/Spinner";

export default class CharList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            error: false,
            fullArr: false,
            newItemsLoading: false,
            key: 0
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

    onCharLoading = () => {
        this.setState({
            loading: true,
            newItemsLoading: true
        })
    }
    
    componentDidMount() {
        const {key} = this.state;
        const oldKey = key;
        const newKey = oldKey + 9;

        this.setState({
            key: newKey
        })

        this.MarvelService
            .getAllCharacters(key)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    onFocusItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove("char__item_selected"));
        this.itemRefs[id].classList.add("char__item_selected");
        this.itemRefs[id].focus();
    }

    onRenderItems = (arr) => {
        const cards = arr.map((item, i) => {
            

            let classNames = "char__img";
            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                classNames+= " notFound";
            }

            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.onFocusItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            this.props.onCharSelected(item.id);
                            this.onFocusItem(i);
                        }
                    }}>
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

    onAddChar = (char) => {
        if (char.length === 0 || char.length < 9) {
            this.setState({
                fullArr: true
            })
        }
        const {data} = this.state;
        const newObj = [...char];
        const newArr = [...data, ...newObj];

        this.setState({
            data: newArr,
            loading: false,
            newItemsLoading: false
        })
    }

    onLoadMore = () => {
        const {key} = this.state;
        const oldKey = key;
        const newKey = oldKey + 9;

        this.setState({
            key: newKey
        })
        
        this.onCharLoading();

        this.MarvelService
        .getAllCharacters(key)
        .then(this.onAddChar)
        .catch(this.onError);
    }

    render() {
        const {data, loading, error, fullArr, newItemsLoading} = this.state;
        const items = this.onRenderItems(data);
        const button = (
            <>
                <button 
                    className="button button__main button__long"
                    style={{"display": fullArr ? "none" : "block"}}
                    onClick={this.onLoadMore}>
                        <div className="inner">load more</div>
                </button>
            </>
        )

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                {newItemsLoading ? <Spinner/> : button}
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}