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
make hints for advanced options work on mobile (likely just take them out of the tooltip and into small text)
better error handling (ie make it communicate about what caused the error. or just do anything that's not doing nothing)
fix convert to mass function (it could be like five different function)
switch to more comprehensive usda database ( i think it might be at https://fdc.nal.usda.gov/? you have link on other computer)

Egg handling needs work. Right now eggs break the converter if they're not ignored
this probably isn't a priority since why the hell would anyone measure eggs by weight
but might be relevant if ie you have a bunch of egg whites in the fridge from pudding
it's probably easiest to just handle it all as a special case, ie just have a function
that does all the egg conversion manually
make sure to handle "eggs", "small/med/lg eggs", and yolks and whites

*/