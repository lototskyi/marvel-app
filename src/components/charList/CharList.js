import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import ImageHelper from '../../helpers/ImageHelper';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    componentDidMount() {
        this.onRequest();  
    }

    onRequest(offset) {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        });
    }

    marvelService = new MarvelService();

    onCharListLoaded = (newChars) => {

        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({offset, chars}) => ({
            chars: [...chars, ...newChars], 
            loading: false, 
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }

    onError = () => {
        this.setState({loading: false, error: true});
    }

    itemRefs = [];

    _setItemRef = item => {
        this.itemRefs.push(item);
    }

    _setItemFocus = (id) => {
        this.itemRefs.forEach(item => {
            item.classList.remove('char__item_selected');
        });
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    _handleClick = (id, charId) => {
        this.props.onCharSelected(charId);
        this._setItemFocus(id);
    }

    getList = (chars) => {
        const imageHelper = new ImageHelper();
    
        const list = chars.map((item, i) => {
            const thStyle = imageHelper.fixImageNotAvailableStyle(item.thumbnail, 'unset');
            
            return (
                <li 
                    className="char__item"
                    tabIndex={0} 
                    ref={this._setItemRef}
                    key={item.id}
                    onClick={() => {
                        this._handleClick(i, item.id)
                    }}
                    onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                this._handleClick(i, item.id)
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

    render() {
        const {chars, loading, error, newItemLoading, offset, charEnded} = this.state;

        const list = this.getList(chars);

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
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;