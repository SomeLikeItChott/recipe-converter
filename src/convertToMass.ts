import { parseIngredient } from 'parse-ingredient';
// idk what's happening here. but it works (for now)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import convert from 'convert';
import fuzzysort from 'fuzzysort';
import densities from './../densities.json';

const convertToMass = (recipe: string, weightUnit: string, convertEggs: boolean, convertButter: boolean, verboseMode: boolean, doNotConvertBelowGrams: number) => {
	const lines = recipe.split(/\r?\n|\r|\n/g);
	const convertedRecipe: string[] = [];
	lines.forEach(line => {
		const ingredient = parseIngredient(line)[0];
		// TODO this is terrible. don't look at these next couple lines. I'll fix it sometime I swear
		let fuzzyResult
		if (ingredient?.description === 'sugar') {
			console.log('its sugar');
			fuzzyResult = fuzzysort.go('white sugar', densities, {key: 'name', limit:1});
		} else {
			fuzzyResult = fuzzysort.go(ingredient?.description, densities, {key: 'name', limit:1});
		}
		console.log(ingredient?.description);
		console.log(ingredient);
		console.log(fuzzyResult);
		try {
			if(fuzzyResult.length != 0 
			&& (convertEggs || !line.includes('egg')) 
			&& (convertButter || !line.includes('butter'))) {
				const cups = convert(ingredient.quantity, ingredient.unitOfMeasureID).to('cups');
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const result = fuzzyResult[0].obj;
				const density = result.density;
				if (density) {
					const grams = cups * density;
					if (grams < doNotConvertBelowGrams) {
						convertedRecipe.push(line);
					} else {
						const mass = convertGramsToWeightUnit(grams, weightUnit);
						const conversion = mass + ' ' + weightUnit + ' ' + ingredient.description + getVerboseInformation(verboseMode, result);
						convertedRecipe.push(conversion);
					}
				} else {
					convertedRecipe.push(createConversionErrorMessage(ingredient.description));
				}
			} else {
				convertedRecipe.push(line);
			}
		} catch (e) {
			convertedRecipe.push(createConversionErrorMessage(ingredient.description));
		}

	});
	return convertedRecipe.join('\n');
};

export default convertToMass;

function convertGramsToWeightUnit(grams: number, weightUnit: string) {
	if (weightUnit === 'grams') {
		return Math.round(grams);
	} else if (weightUnit === 'ounces') {
		const ounces = grams * 0.0352739619;
		return Math.round(ounces * 10) / 10;
	} else {
		throw new Error('Unknown weight unit');
	}
}
function getVerboseInformation(verboseMode: boolean, result: { name: string; density: number; }) {
	return verboseMode ? ' (using density for ' + result.name + ')' : '';
}

function createConversionErrorMessage(ingredientDescription: string) {
	return ('Error converting ' + ingredientDescription);
}

