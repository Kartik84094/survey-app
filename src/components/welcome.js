import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();
    const openSurveyForm = () => { navigate('/surveyForm'); }

    return (
        <>
            <button className='start-button' onClick={() => openSurveyForm()}>Start</button>
        </>
    )
}