import { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import ImageHelper from '../../helpers/ImageHelper';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

const CharList = (props) => {

    const [chars, setChars] = useState([]);
    const [newItemLoading, setItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    // eslint-disable-next-line
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setItemLoading(false): setItemLoading(true);
        
        getAllCharacters(offset)
            .then(onCharListLoaded);
    }

    const onCharListLoaded = (newChars) => {

        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newChars]);
        setItemLoading(false);
        setOffset(offset => offset + 12);
        setCharEnded(ended);
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
                <CSSTransition key={item.id} timeout={10} classNames="char__item">
                    <li 
                        className="char__item"
                        tabIndex={0} 
                        ref={el => itemRefs.current[i] = el}
                        
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
                </CSSTransition>
            );
        });
        return (
            <TransitionGroup component={'ul'} className="char__grid">
                {list}            
            </TransitionGroup>
        );
    }
    
    const list = getList(chars);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {list}
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