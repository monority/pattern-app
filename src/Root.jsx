import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/tools/ScrollToTop';
import Header from './components/ui/Header';
import Home from './pages/Home';
import AppContainer from './components/tools/AppContainer';


const Root = () => {
	return (
		<BrowserRouter>
			<ScrollToTop>
				<Header></Header>
				<AppContainer>

					<Routes>
						<Route exact path="/" element={<Home />} />
					</Routes>
				</AppContainer>
			</ScrollToTop>
		</BrowserRouter>
	)
}

export default Root;

