import './charList.scss';
import {useState, useEffect, useRef} from 'react';
import PropTypes from "prop-types";

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from "../spinner/Spinner";

const CharList = (props) => {
    const [data, setData] = useState([]);
    const [fullArr, setFullarr] = useState(false);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [key, setKey] = useState(0);    


    const {loading, error, getAllCharacters} = useMarvelService();

    const onCharsLoaded = (char) => {
        setData(char);
    }

    const onCharLoading = (initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
    }
    
    useEffect((key) => {
        setKey(key => key + 9);

        getAllCharacters(key)
            .then(onCharsLoaded)
    }, [])


    const itemRefs = useRef([]);

    const onFocusItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove("char__item_selected"));
        itemRefs.current[id].classList.add("char__item_selected");
        itemRefs.current[id].focus();
    }

    const onRenderItems = (arr) => {
        const cards = arr.map((item, i) => {
        
            let classNames = "char__img";
            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                classNames+= " notFound";
            }

            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        onFocusItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(item.id);
                            onFocusItem(i);
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

    const onAddChar = (char) => {
        if (char.length === 0 || char.length < 9) {
            setFullarr(true);
        }

        setData([...data, ...char]);
        setNewItemsLoading(false);
    }

    const onLoadMore = (initial) => {
        setNewItemsLoading(true);
        setKey(key => key + 9);
        
        onCharLoading(initial);

        getAllCharacters(key)
            .then(onAddChar)
    }

    const items = onRenderItems(data);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemsLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{"display": fullArr ? "none" : "block"}}
                onClick={() => onLoadMore(false)}>
                    <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;