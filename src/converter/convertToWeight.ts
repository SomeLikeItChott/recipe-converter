import { parseIngredient } from 'parse-ingredient';
// someone that knows more about typescript than me should look at this fix
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import convert from 'convert';
import fuzzysort from 'fuzzysort';
import densities from '../../densities.json';

const convertToWeight = (recipe: string, weightUnit: string, convertEggs: boolean, convertButter: boolean, verboseMode: boolean, doNotConvertBelowGrams: number) => {
	const lines = recipe.split(/\r?\n|\r|\n/g);
	const convertedRecipe: string[] = [];
	lines.forEach(line => {
		const ingredient = parseIngredient(line)[0];
		const ingredientDescription = simplifyIngredientDescription(ingredient?.description);
		const fuzzyResult = fuzzysort.go(ingredientDescription, densities, {key: 'name', limit:1});
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
						const weight = convertGramsToWeightUnit(grams, weightUnit);
						const conversion = weight + ' ' + weightUnit + ' ' + ingredient.description + getVerboseInformation(verboseMode, result);
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

// the fuzzysorter gets confused by some common ingredients
// ie 'sugar' is closer to 'brown sugar' than 'white sugar' according to it
// so we manually fudge them a lil bit here
function simplifyIngredientDescription(ingredientDescription: string) {
	if (ingredientDescription === 'sugar') {
		return 'white sugar';
	} else {
		return ingredientDescription;
	}
}

export default convertToWeight;