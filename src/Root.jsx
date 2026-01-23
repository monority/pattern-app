import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/tools/ScrollToTop';
import Header from './components/ui/Header';
import Home from './pages/Home';


const Root = () => {
	return (
		<BrowserRouter>
			<ScrollToTop>
				<Header></Header>
				<Routes>
					<Route exact path="/" element={<Home />} />
				</Routes>
			</ScrollToTop>
		</BrowserRouter>
	)
}

export default Root;

