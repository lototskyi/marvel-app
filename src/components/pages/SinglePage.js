import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import SingleCharacterPage from './singleCharacterPage/SingleCharacterPage';
import SingleComicPage from './singleComicPage/SingleComicPage';

import useMarvelService from '../../services/MarvelService';

const SinglePage = ({type}) => {

    const {id} = useParams();
    const [data, setData] = useState(null);

    const {loading, error, getComic, getCharacter} = useMarvelService();

    useEffect(() => {
        updateData();
    // eslint-disable-next-line
    }, [id]);


    const updateData = () => {
        console.log(id);
        switch(type) {
            case 'comic':
                getComic(id).then(onDataLoaded);
                break;
            case 'char':
                getCharacter(id).then(onDataLoaded);
                break;
            default:
                break;
        }
        
    }

    const onDataLoaded = (data) => {
        setData(data);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !data) ? <View type={type} data={data}/> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )

    
}

const View = ({type, data}) => {
    return(
        type === 'comic' ? <SingleComicPage data={data} /> : <SingleCharacterPage data={data}/>
    );
}

export default SinglePage;