import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Welcome from './components/welcome';
import Survey from './components/survey';

export default function App() {

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Welcome />} />
					<Route path="/surveyForm" element={<Survey />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}
