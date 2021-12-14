import {useEffect, useState} from 'react';

import useMarvelService from "../../services/MarvelService";
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import './comicsList.scss';

const ComicsList = () => {
    const {getComics, error, loading, clearError} = useMarvelService();
    const [key, setKey] = useState(0);
    const [data, setData] = useState([]);
    const [arrEnded, setErrEnded] = useState(false);

    const onLoadComics = (data) => {
        setData(data);
    }

    useEffect(() => {
        setKey(key => key + 8);

        clearError();
        getComics(key)
        .then(onLoadComics);
    }, [])

    const onAddMoreComics = (comics) => {
        comics && comics.length < 8 ? setErrEnded(true) : setErrEnded(false);
        
        setData(data => [...data, ...comics])
    }

    const onLoadMore = () => {
        setKey(key => key + 8);

        clearError();
        getComics(key)
            .then(onAddMoreComics);
    }

    const onRenderItems = (data) => {
        const items = data.map((item, i) => {
            let imgStyle = {'objectFit': 'cover'};
            if (item.image === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = {'objectFit': 'fill'};
            }
    
            return (
                <li 
                    className="comics__item"
                    key={i}>
                    <a href={item.url}>
                        <img 
                            src={item.image} 
                            alt="ultimate war" 
                            className="comics__item-img"
                            style={imgStyle}/>
                        <div className="comics__item-name">{item.name}</div>
                        <div className="comics__item-price">{item.price === 0 ? "NOT AVALIABLE" : `${item.price}$`}</div>
                    </a>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }
    const content = onRenderItems(data);

    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <div className="comics__list">
            {content}
            {spinner}
            {errorMessage}
            <button 
                className="button button__main button__long"
                disabled={loading}
                style={arrEnded ? {"display": "none"} : {"display": "block"}}
                onClick={onLoadMore}>
                    <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;