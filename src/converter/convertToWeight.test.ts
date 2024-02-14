import convertToWeight from './convertToWeight';

/*
We'd like to test comprehensively that many ingredients are detected correctly
(ie test that '1 large egg' is detected as 'fresh eggs' or whatever)
BUT those tests are really brittle, depending on the exact wording used by
the ingredient database we're using

SO we do some of those tests for problem ingredients, but do broader tests
for ingredient density detection, that look for a result close to the one we expect
Those tests should be less brittle and should hold up to ingredient data changes
and are partially just to sanity check the data on new ingredient databases
*/

const ingredientLinesForExactName = [
	{line: '1 cup sugar', result: '(using density for sugar (granulated white))'},
	{line: '1 cup sugar, sifted', result: '(using density for sugar (granulated white))'},
	{line: '1 cup butter', result: '(using density for butter)'},
	{line: '1 cup butter, softened', result: '(using density for butter)'},
	{line: '1 cup flour', result: '(using density for all-purpose flour)'},
	{line: '1 cup white flour', result: '(using density for all-purpose flour)'},
	{line: '1 cup A.P. flour', result: '(using density for all-purpose flour)'},
	{line: '1 cup AP flour', result: '(using density for all-purpose flour)'},
];

const ingredientLinesForDensity = [
	{line: '1 cup sugar', expectedGrams: 198},
	{line: '1 cup butter', expectedGrams: 226},
	{line: '2 ¼ cups sugar', expectedGrams: 450},
	{line: '¼ cup sugar', expectedGrams: 50},
	{line: '1/4 cup sugar', expectedGrams: 50},
	{line: '.25 cup sugar', expectedGrams: 50},
	{line: '0.25 cup sugar', expectedGrams: 50},
	{line: '4 tbsp sugar', expectedGrams: 50},
	{line: '4 tablespoons sugar', expectedGrams: 50},
];

// These will break on changing ingredient DB. That's ok and expected
// just change the input data and check that it all still makes sense
it.each(ingredientLinesForExactName)('should detect $line', ({line, result}) => {
	expect(convertToWeight(line, 'grams', true, true, true, 0))
		.toContain(result);
});

it.each(ingredientLinesForDensity)('should convert $line to around $expectedGrams grams', ({line, expectedGrams}) => {
	const convertedLine = convertToWeight(line, 'grams', true, true, true, 0);
	const numGrams = convertedLine.split(' ')[0];
	const differencePercentage = Math.abs(parseInt(numGrams) - expectedGrams) / expectedGrams;
	expect(differencePercentage).toBeLessThanOrEqual(0.2);
});
