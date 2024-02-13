import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);

/*
todo: (not in order, do what calls to you)

accessibility
make textboxes prettier?
styling
unit tests
better error handling (ie make it communicate about what caused the error. or just do anything that's not doing nothing)
fix convert to mass function (it could be like five different function)
switch to more comprehensive usda database ( i think it might be at https://fdc.nal.usda.gov/? you have link on other computer)

Notes:
will need to handle, either in converter or in scraper, these special cases:
(wow! what a good time to write some unit tests!!!)
1 large egg
1/4 cup unsalted butter, cubed

*/