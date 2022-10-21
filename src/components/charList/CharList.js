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

    onCharLoaded = (chars) => {
        this.setState({chars, loading: false});
    }

    onError = () => {
        this.setState({loading: false, error: true});
    }

    updateCharList = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    render() {
        const {chars, loading, error} = this.state;

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <List chars={chars}/> : null;

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

const List = ({chars}) => {
    const list = chars.map(item => {
        const imageHelper = new ImageHelper();
        const thStyle = imageHelper.fixImageNotAvailableStyle(item.thumbnail);
        
        return (
            <li className="char__item" key={item.id}>
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

export default CharList;