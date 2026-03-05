import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/tools/ScrollToTop';
import Header from './components/ui/Header';
import { ToastProvider } from './components/ui/Toast';
import Home from './pages/Home';
import AppContainer from './components/tools/AppContainer';


const Root = () => {
	return (
		<BrowserRouter>
			<ToastProvider>
				<ScrollToTop>
					<Header></Header>
					<AppContainer>

						<Routes>
							<Route exact path="/" element={<Home />} />
						</Routes>
					</AppContainer>
				</ScrollToTop>
			</ToastProvider>
		</BrowserRouter>
	)
}

export default Root;

