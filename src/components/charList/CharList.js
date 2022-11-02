import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import ImageHelper from '../../helpers/ImageHelper';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

const CharList = (props) => {

    const [chars, setChars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, []);

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService
            .getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError);
    }

    const onCharListLoading = () => {
        setItemLoading(true);
    }

    const onCharListLoaded = (newChars) => {

        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newChars]);
        setLoading(false);
        setItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const itemRefs = useRef([]);

    const _setItemFocus = (id) => {
        itemRefs.current.forEach(item => {
            item.classList.remove('char__item_selected');
        });
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const _handleClick = (id, charId) => {
        props.onCharSelected(charId);
        _setItemFocus(id);
    }

    const getList = (chars) => {
        const imageHelper = new ImageHelper();
    
        const list = chars.map((item, i) => {
            const thStyle = imageHelper.fixImageNotAvailableStyle(item.thumbnail, 'unset');
            
            return (
                <li 
                    className="char__item"
                    tabIndex={0} 
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        _handleClick(i, item.id)
                    }}
                    onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                _handleClick(i, item.id)
                            }
                        }
                    }>
                    <img style={thStyle} src={item.thumbnail} alt={item.name}/>
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });
        return (
            <ul className="char__grid">
                {list}            
            </ul> 
        );
    }
    
    const list = getList(chars);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? list : null;

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {content}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;