import { ChangeEvent, useState } from 'react';
import './App.css';
import convertToMass from '../../convertToMass';
import Accordion from '../accordion/Accordion';
import styled, { css } from 'styled-components';
import InfoPopover from '../popover/InfoPopover';
import { bananaBread, sweetPotatoPie, tollHouseCookies } from '../../assets/PresetRecipes';

function App() {
	const [rawRecipe, setRawRecipe] = useState<string>('');
	const [convertedRecipe, setConvertedRecipe] = useState<string>('');
	const [weightUnit, setWeightUnit] = useState<string>('grams'); // this should really be an enum
	const [convertButter, setConvertButter] = useState<boolean>(false);
	const [convertEggs, setConvertEggs] = useState<boolean>(false);
	const [verboseMode, setVerboseMode] = useState<boolean>(true);
	const [doNotConvertBelowGrams, setDoNotConvertBelowGrams] = useState<string>('15');
	const [isButtonFlashing, setIsButtonFlashing] = useState<boolean>(false);

	const convert = () => {
		setConvertedRecipe(convertToMass(rawRecipe, weightUnit, convertEggs, convertButter, verboseMode, Number(doNotConvertBelowGrams)));
	};

	const handleWeightUnitChange = (e: ChangeEvent<HTMLInputElement>) => {
		setWeightUnit(e.target.value);
	};

	const capitalizeFirstLetter = (string: string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	const handleDoNotConvertBelowGramsChange = (e: ChangeEvent<HTMLInputElement>) => {
		//do not allow non-digit characters
		setDoNotConvertBelowGrams(e.target.value.replace(/[^\d]/gi, ''));
	};

	const flashConvertButton = () => {
		setIsButtonFlashing(true);
		setTimeout(() => {setIsButtonFlashing(false);},820);
	};

	const enterPresetRecipe = (recipe: string) => {
		setRawRecipe(recipe);
		flashConvertButton();
	};

	return (
		<>
			<div id="main">
				<TitleText>Volume to Weight Recipe Converter</TitleText>
				<p>
					Measuring baking ingredients by weight instead of volume is generally more accurate and less messy. Check out <a href="https://www.seriouseats.com/how-to-measure-wet-dry-ingredients-for-baking-accurately-best-method#toc-measuring-by-weight-just-do-it">this article</a> for more information.
				</p>
				<div>Copy and paste your recipe, or try it with an American classic:
					<RecipeList>
						<li><RecipeChooser onClick={() => enterPresetRecipe(tollHouseCookies)}>Chocolate chip cookies</RecipeChooser></li>
						<li><RecipeChooser onClick={() => enterPresetRecipe(bananaBread)}>Banana bread</RecipeChooser></li>
						<li><RecipeChooser onClick={() => enterPresetRecipe(sweetPotatoPie)}>Sweet potato pie</RecipeChooser></li>
					</RecipeList>
				</div>
				<div id="converter">
					<div className="ingredients-wrapper">
						Volume recipe:
						<textarea value={rawRecipe} onChange={e => setRawRecipe(e.target.value)} placeholder='Paste ingredient list here'></textarea>
					</div>
					<div className="ingredients-wrapper">
						Weight recipe:
						<textarea readOnly value={convertedRecipe} />
					</div>
				</div>
				<div>Convert to: 
					{['grams', 'ounces'].map((unit) => 
						<label>
							<input type="radio" 
								key={unit} 
								value={unit} 
								checked={weightUnit === unit} 
								onChange={handleWeightUnitChange} />
							{capitalizeFirstLetter(unit)}
						</label>
					)}
				</div>
				<ButtonWrapper>
					<ConvertButton onClick={convert} isFlashing={isButtonFlashing}>
						Convert
					</ConvertButton>
				</ButtonWrapper>
				<SettingsAccordion toggleText='Advanced settings'>
					<div id="controls">
						<div>
							<label>
								Give conversion information?	
								<InfoPopover>The converter tells you what ingredients it detected in the recipe so that you can double check its work, but you can disable this for a nicer-looking recipe to copy and paste.</InfoPopover>				
								<input id="verboseMode" type="checkbox" checked={verboseMode} onChange={(e) => setVerboseMode(e.target.checked)} />
							</label>
						</div>
						<div>
							<label>
								Do not convert to weight below this many grams:	
								<InfoPopover>It's hard to measure very small amounts on a scale. Use this setting to adjust which small amounts will be converted and which will be left as volume.</InfoPopover>				
								<input type="text" id="doNotConvertBelowGrams" value={doNotConvertBelowGrams} onChange={handleDoNotConvertBelowGramsChange}/>
							</label>
						</div>
						<div>
							<label>
								Convert butter amounts?					
								<input id="convertButter" type="checkbox" checked={convertButter} onChange={(e) => setConvertButter(e.target.checked)} />
							</label>
						</div>
						<div>
							<label>
								Convert egg amounts?
								<input id="convertEggs" type="checkbox" checked={convertEggs} onChange={(e) => setConvertEggs(e.target.checked)} />
							</label>
						</div>
						<p>Note: if the converter isn't detecting ingredients correctly, it may help to remove extraneous information or parentheticals from the ingredients list.</p>
					</div>
				</SettingsAccordion>
				<h6>Ingredient densities taken from <a href="https://www.kingarthurbaking.com/learn/ingredient-weight-chart">King Arthur Flour Ingredient Weight Chart.</a></h6>
			</div>			
		</>
	);
}

const TitleText = styled.h1`
	font-size: 36px;
	@media (min-width: 700px) {
		font-size: 52px;
	  }
`;

const ButtonWrapper = styled.div`
	margin: 1em 0;
`;

const RecipeList = styled.ul`
	list-style-type: none;
	padding: 0;
`;

const SettingsAccordion = styled(Accordion)`
	margin: 0.5em 0;
`;

const ConvertButton = styled.button<{ isFlashing: boolean; }>`
	transition: background-color 0.8s cubic-bezier(0.37, 0, 0.63, 1);
	${props =>
		props.isFlashing &&
		css`
		background-color: #4dff88;

	`};
`;

const RecipeChooser = styled.a`
	cursor: pointer;
`;

export default App;
