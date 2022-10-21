import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ImageHelper from '../../helpers/ImageHelper';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false
    }

    componentDidMount() {
        this.updateCharList();  
    }

    marvelService = new MarvelService();

    onCharListLoaded = (chars) => {
        this.setState({chars, loading: false});
    }

    onError = () => {
        this.setState({loading: false, error: true});
    }

    updateCharList = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    getList = (chars) => {
        const imageHelper = new ImageHelper();
    
        const list = chars.map(item => {
            const thStyle = imageHelper.fixImageNotAvailableStyle(item.thumbnail, 'unset');
            
            return (
                <li 
                    className="char__item" 
                    key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}>
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
        const {chars, loading, error} = this.state;

        const list = this.getList(chars);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? list : null;

        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

}

export default CharList;