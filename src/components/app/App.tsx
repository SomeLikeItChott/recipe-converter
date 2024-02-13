import { ChangeEvent, useState } from 'react';
import './App.css';
import convertToWeight from '../../converter/convertToWeight';
import styled, { css } from 'styled-components';
import { bananaBread, sweetPotatoPie, tollHouseCookies } from '../../assets/PresetRecipes';
import SettingsAccordion from '../settingsAccordion/settingsAccordion';

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
		setConvertedRecipe(convertToWeight(rawRecipe, weightUnit, convertEggs, convertButter, verboseMode, Number(doNotConvertBelowGrams)));
	};

	const handleWeightUnitChange = (e: ChangeEvent<HTMLInputElement>) => {
		setWeightUnit(e.target.value);
	};

	const capitalizeFirstLetter = (string: string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
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
				<Converter>
					<RawRecipe className="ingredients-wrapper">
						Volume recipe:
						<textarea value={rawRecipe} onChange={e => setRawRecipe(e.target.value)} placeholder='Paste ingredient list here'></textarea>
					</RawRecipe>
					<ConvertedRecipe className="ingredients-wrapper">
						Weight recipe:
						<textarea readOnly value={convertedRecipe} />
					</ConvertedRecipe>
					<Settings>Convert to: 
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
						<ButtonWrapper>
							<ConvertButton onClick={convert} isFlashing={isButtonFlashing}>
						Convert
							</ConvertButton>
						</ButtonWrapper>
						<SettingsAccordion 
							verboseMode={verboseMode} 
							setVerboseMode={setVerboseMode} 
							doNotConvertBelowGrams={doNotConvertBelowGrams}
							setDoNotConvertBelowGrams={setDoNotConvertBelowGrams}
							convertButter={convertButter}
							setConvertButter={setConvertButter}
							convertEggs={convertEggs}
							setConvertEggs={setConvertEggs} />
					</Settings>
				</Converter>
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

const Converter = styled.div`
	display: grid;
	gap: 1em;
	justify-content: center;
	justify-items: center;
`;

const RecipeWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width:100%;
	max-width: 25em;
`;

const RawRecipe = styled(RecipeWrapper)`
	@media (min-width: 700px) {
		justify-self: end;
	}
`;

const ConvertedRecipe = styled(RecipeWrapper)`
	@media (min-width: 700px) {
		justify-self: start;
	}
`;

const Settings = styled.div`
	@media (min-width: 700px) {
		grid-column-start: span 2;
	}
`;

const ButtonWrapper = styled.div`
	margin: 1em 0;
`;

const RecipeList = styled.ul`
	list-style-type: none;
	padding: 0;
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
