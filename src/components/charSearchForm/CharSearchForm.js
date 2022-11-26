import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, ErrorMessage as FormikErrorMessage, Field } from 'formik';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charSearchForm.scss';

const CharSearchForm = () => {
    
    const [char, setChar] = useState();
    const {loading, error, getCharacterByName} = useMarvelService();

    const updateChar = (name) => {
        getCharacterByName(name)
            .then((data) => {
                setChar(data)
            });
    } 

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;
    const results = !char ? null : char.length > 0 ?
                    <div className="char__search-wrapper">
                        <div className="char__search-success">There is! Visit {char[0].name} page?</div>
                        <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                            <div className="inner">To page</div>
                        </Link>
                    </div> : 
                    <div className="char__search-error">
                        The character was not found. Check the name and try again
                    </div>;

    return(
        <div className="char__search-form">
            <Formik
                initialValues={{charName: ''}}
                validate={values => {
                    const errors = {};
                    if (!values.charName) {
                      errors.charName = 'Required!';
                    } else if (values.charName.length < 2) {
                      errors.charName = 'Must be at Least 2 chars!';
                    }
                    return errors;
                }}
                onSubmit={(values) => updateChar(values.charName)}
            >
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                            id="charName" 
                            name='charName' 
                            type='text' 
                            placeholder="Enter name"/>
                        <button 
                            type='submit' 
                            className="button button__main"
                            disabled={loading}
                            >
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="charName" />
                </Form>
            </Formik>
            {errorMessage}
            {results}
        </div>
    );
}

export default CharSearchForm;