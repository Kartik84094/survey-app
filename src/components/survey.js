import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from '../utils/questions.json'
import { v4 as uniqid } from 'uuid';
import { getStorage, setUserInStorage } from '../utils/storage';

export default function Survey() {

	const navigate = useNavigate();
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [surveyDone, setSurveyDone] = useState(false);
	const [comment, setComment] = useState("");
	const [surveyResponseArray, setSurveyResponseArray] = useState([]);
	const addSurveyResponse = (question, value) => {
		setSurveyResponseArray([...surveyResponseArray, { question, value }]);
	};

	const handleSubmitButtonClick = () => {
		setComment(comment)
		surveyResponseArray.push({ question: questions[currentQuestion].questionText, value: comment })

		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			showConfirmationPage();
		}
	};
	const handleNextButtonClick = () => {

		addSurveyResponse(questions[currentQuestion].questionText, '')
		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			showConfirmationPage()
		}
	};
	const handleAnswerOptionClick = (value) => {

		addSurveyResponse(questions[currentQuestion].questionText, value)
		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			showConfirmationPage();
		}
	};

	const handlePreviousOptionClick = () => {

		const nextQuestion = currentQuestion - 1;
		if (nextQuestion < questions.length && nextQuestion >= 0) {
			setCurrentQuestion(nextQuestion);
		} else {
			console.log('first questions')
		}
	};

	function removeDuplicates(originalArray, prop) {
		var newArray = [];
		var lookupObject = {};

		for (var i in originalArray) {
			lookupObject[originalArray[i][prop]] = originalArray[i];
		}

		for (i in lookupObject) {
			newArray.push(lookupObject[i]);
		}
		return newArray;
	}

	const showConfirmationPage = () => {

		const confirmBox = window.confirm(
			"Do you really want to submit this survey?"
		)
		if (confirmBox === true) {
			setSurveyDone(true);
			var uniqueArray = removeDuplicates(surveyResponseArray, "question");

			if (getStorage('users')) {

				const userId = uniqid()
				const users = getStorage('users')
				const user = { id: userId, surveyResponse: uniqueArray, status: 'COMPLETED', }
				users.push(user)

				setUserInStorage('users', users)

			} else {
				const userId = uniqid()
				const users = [{ id: userId, surveyResponse: uniqueArray, status: 'COMPLETED', }]

				setUserInStorage('users', users)
			}
			setTimeout(redirectSartPage, 5000);
		}
		else {
			console.log('cancel');
		}
	}

	const redirectSartPage = () => {
		navigate('/')
	}

	return (
		<div className='app'>
			{surveyDone ?
				(
					<div className='score-section'>
						Thankyou for your time!
					</div>
				) : (
					<>
						<div className='question-section'>
							<div className='heading'> Customer Survey</div>
							<div className='question-count'>{currentQuestion + 1}/{questions.length}</div>
							<div className='question-text'>{currentQuestion + 1}. {questions[currentQuestion].questionText}</div>
							<div className='answer-section'>
								{(() => {
									if (!questions[currentQuestion].answerOptions.length) {
										return (
											<textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="4" cols="30"></textarea>
										)
									} else {
										return (
											questions[currentQuestion].answerOptions.map((answerOption) => (
												<button onClick={() => handleAnswerOptionClick(answerOption.value)}>{answerOption.answerText}</button>
											))
										)
									}
								})()}
							</div>
							<div className='prev-next-section'>
								<button id='prev' onClick={() => handlePreviousOptionClick()}>Prev</button>
								{(() => {
									if (currentQuestion === questions.length - 1) {
										return (
											<button id='submit' onClick={() => handleSubmitButtonClick()}>Submit</button>
										)
									} else {
										return (
											<button id='next' onClick={() => handleNextButtonClick()}>Next</button>
										)
									}
								})()}
							</div>
						</div>
					</>
				)}
		</div>
	);
}