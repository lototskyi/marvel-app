import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import useMarvelService from '../../services/MarvelService';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const ComicsList = () => {

    const {loading, error, getAllComics} = useMarvelService();

    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage: !comicsEnded,
        onLoadMore: () => onRequest(offset),
    });

    useEffect(() => {
        onRequest(offset, true);
    // eslint-disable-next-line
    }, []);


    const onRequest = (offset, initial) => {
        initial ? setItemLoading(false): setItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded);
    }

    const onComicsListLoaded = (newComics) => {
        let ended = false;
        if (newComics.length < 8) {
            ended = true;
        }

        setComics(comics => [...comics, ...newComics]);
        setItemLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    const getList = (comics) => {
    
        const list = comics.map((item, i) => {
            
            return (
                <li 
                    className="comics__item"
                    tabIndex={0} 
                    key={i}>
                    {/*  eslint-disable-next-line */}    
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            );
        });
        return (
            <ul className="comics__grid">
                {list}            
            </ul> 
        );
    }

    const list = getList(comics);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            {list}
            <button ref={sentryRef} className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;