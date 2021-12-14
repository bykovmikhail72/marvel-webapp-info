import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {
    const {loading, error, response, clearError} = useHttp();

    const _apiBase = "https://gateway.marvel.com:443/v1/public/";
    const _apiKey = "apikey=aa6c55833c9c60f691a31b9416fc4bef";

    const getAllCharacters = async (key) => {
        const res = await response(`${_apiBase}characters?limit=9&offset=${key}&${_apiKey}`);
        return res.data.results.map(_transormCharacter);
    }

    const getCharacters = async (id) => {
        const res = await response(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transormCharacter(res.data.results[0]);
    }

    const getComics = async (key) => {
        const res = await response(`${_apiBase}comics?limit=8&offset=${key}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const _transormCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            descr: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items.slice(0, 10)
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            name: comics.title,
            image: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            price: comics.prices[0].price,
            url: comics.urls[0].url
        }
    }

    return {loading, error, getAllCharacters, getCharacters, clearError, getComics}
}

export default useMarvelService;