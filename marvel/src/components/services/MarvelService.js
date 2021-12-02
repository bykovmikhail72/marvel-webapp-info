class MarvelService {
    _apiBase = "https://gateway.marvel.com:443/v1/public/";
    _apiKey = "apikey=aa6c55833c9c60f691a31b9416fc4bef";

    getResource = async (url) => {
        let res = await fetch (url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`)
        }

        return await res.json();
    }

    getAllCharacters = async (key) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${key}&${this._apiKey}`);
        return res.data.results.map(this._transormCharacter);
    }

    getCharacters = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transormCharacter(res.data.results[0]);
    }

    _transormCharacter = (char) => {
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

}

export default MarvelService;