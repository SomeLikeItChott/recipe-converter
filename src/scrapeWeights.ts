import axios from 'axios';
import * as jsdom from 'jsdom';
// idk what's happening here. but it works (for now)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import convert from 'convert';
import { writeFile } from 'node:fs';

const { JSDOM } = jsdom;

const splitOnLastSpace = (str: string) => {
	const rest = str.substring(0, str.lastIndexOf(' ') + 1);
	const last = str.substring(str.lastIndexOf(' ') + 1, str.length);
	return [rest, last];
};

const evalFraction = (str: string) => {
	const [beforeSlash, denominator] = str.split('/');
	if (denominator) {
		let numerator, wholeNumber;
		// this is weird but keep in mind we need to handle, ie '2 1/4'
		const [beforeSpace, afterSpace] = beforeSlash.split(' ');
		if (afterSpace) {
			wholeNumber = beforeSpace;
			numerator = afterSpace;
		} else {
			wholeNumber = 0;
			numerator = beforeSpace;
		}
		return Number(wholeNumber) + (Number(numerator) / Number(denominator));
	} else {
		return Number(str);
	}
};

/*
* Incredibly brittle one-page scraper to get 
* ingredient weights off of king arthur flour's website.
*
* run with 'yarn scrape'
*/
// TODO make real type for this
const ingredientDensities: object[] = [];

axios
	.get('https://www.kingarthurbaking.com/learn/ingredient-weight-chart')
	.then(function (response) {
		const dom = new JSDOM(response.data);
		[...dom.window.document.querySelectorAll('tr')].forEach(el => {
			let name, volume, weight;
			el.querySelectorAll('th').forEach(el => {
				name = el.textContent?.toLowerCase();
			});
			const numbers = el.querySelectorAll('td');
			if(numbers[0]) {
				volume = numbers[0].textContent;
				// remove stuff in parens from volume, ie '8 tbsp (1/2 cup)' -> '8 tbsp'
				if (volume && volume.includes('(')) {
					volume = volume.substring(0, volume.indexOf('(')).trim();
				}
				weight = numbers[2].textContent;
			}

			if (name && volume && weight) {
				try {
					console.log(volume);
					const [volNum, volUnit] = splitOnLastSpace(volume);
					const evaluatedVolNum = evalFraction(volNum);
					const normalizedVolUnit = volUnit.replace(/\W/g, '');
					console.log(volNum);
					console.log(Number(volNum));
					console.log(evaluatedVolNum);
					console.log(normalizedVolUnit);
					console.log(weight);
					const cups = convert(Number(evaluatedVolNum), normalizedVolUnit).to('cups');
					const cupsWeight = Number(weight)/cups;
					console.log('there are ' + cupsWeight + ' grams in a cup of ' + name);
					ingredientDensities.push({name, density: cupsWeight});
				} catch (e) {
					console.log('problem: ' + e);
				}
			}
		});
		console.log(JSON.stringify(ingredientDensities));
		writeFile('densities.json', JSON.stringify(ingredientDensities), (err) => {
			if (err) throw err;
			console.log('The file has been saved!');
		}); 
	});	

