import { Ingredient, parseIngredient } from 'parse-ingredient';
// someone that knows more about typescript than me should look at this fix
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import convert from 'convert';
import fuzzysort from 'fuzzysort';
import densities from '../../densities.json';

//Words that seem irrelevant to ingredient density
//while trying to match ingredients we'll remove these if we can't find a match
//this list is kind of ad hoc, add more if they will be helpful
const fillerIngredientWords: string[] = ['semisweet', 'plain', 'sweet', 'bitter', 'salted', 'unsalted'];

const convertToWeight = (recipe: string, weightUnit: string, convertEggs: boolean, convertButter: boolean, verboseMode: boolean, doNotConvertBelowGrams: number) => {
	const lines = recipe.split(/\r?\n|\r|\n/g);
	const convertedRecipe: string[] = [];
	lines.forEach(line => {
		const ingredient = parseSimplifiedLine(line);
		const fuzzyResult = detectIngredient(ingredient?.description);
		try {
			if(fuzzyResult.length != 0 
			&& (convertEggs || !line.includes('egg')) 
			&& (convertButter || !line.includes('butter'))) {
				const cups = convertIngredientToCups(ingredient);
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
			console.log(e);
			convertedRecipe.push(createConversionErrorMessage(ingredient.description));
		}

	});
	return convertedRecipe.join('\n');
};

function convertIngredientToCups(ingredient: Ingredient) {
	return convert(ingredient.quantity, ingredient.unitOfMeasureID).to('cups');
}

function parseSimplifiedLine(line:string) {
	let simplifiedLine = line;
	if (line.charAt(0) === '.') {
		simplifiedLine = '0' + line;
	}
	return parseIngredient(simplifiedLine)[0];
}

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
	if (matchesOneOfCaseInsensitive(ingredientDescription, ['sugar'])) {
		return 'white sugar';
	} else if (matchesOneOfCaseInsensitive(ingredientDescription, 
		['flour', 'white flour', 'ap flour', 'a.p. flour'])) {
		return 'all-purpose flour';
	} else {
		return ingredientDescription;
	}
}

function matchesOneOfCaseInsensitive(ingredientDescription: string, matchers: string[]) {
	const result = matchers.some((matcher) => {
		return ingredientDescription?.localeCompare(matcher, undefined, {sensitivity: 'accent'}) === 0;
	});
	return result;
}

export default convertToWeight;

//I know that this should have like ten tiny named functions instead of comments
// but since this is a side project I'm not bothering with that
function detectIngredient(ingredientDescription: string) {
	let description = ingredientDescription;
	let result = getFuzzyResult(description);

	if (result.length === 0 && description?.includes(',')) {
		//remove comma
		description = description.split(',')[0];
		result = getFuzzyResult(description);
	} 
	if (result.length === 0 && description?.includes('(')) {
		//remove parentheticals 
		//(kinda, will just remove anything after parentheticals. it should mostly work)
		description = description.split('(')[0];
		result = getFuzzyResult(description);
	}  
	if (result.length === 0 && description) {
		//final attempt; just try removing a bunch of filler words and see if we get a match
		description = removeFromString(fillerIngredientWords, description);
		result = getFuzzyResult(description);
	}

	return result;
}

// taken from https://stackoverflow.com/questions/58376549/how-to-remove-an-array-of-words-from-a-string-in-javascript
function removeFromString(arr: string[],str: string){
	const regex = new RegExp('\\b'+arr.join('|')+'\\b','gi');
	return str.replace(regex, '');
}

function getFuzzyResult(ingredientDescription: string) {
	const simplifiedIngredientDescription = simplifyIngredientDescription(ingredientDescription);
	return fuzzysort.go(simplifiedIngredientDescription, densities, {key: 'name', limit:1});
}
