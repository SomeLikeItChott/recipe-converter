import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import Accordion from '../accordion/Accordion';
import InfoPopover from '../popover/InfoPopover';

export interface SettingsAccordionProps {
    verboseMode: boolean;
    setVerboseMode: Dispatch<SetStateAction<boolean>>;
    doNotConvertBelowGrams: string;
    setDoNotConvertBelowGrams: Dispatch<SetStateAction<string>>;
    convertButter: boolean;
    setConvertButter: Dispatch<SetStateAction<boolean>>;
    convertEggs: boolean;
    setConvertEggs:Dispatch<SetStateAction<boolean>>;
}

function SettingsAccordion({verboseMode, 
	setVerboseMode, 
	doNotConvertBelowGrams,
	setDoNotConvertBelowGrams,
	convertButter, 
	setConvertButter, 
	convertEggs, 
	setConvertEggs}: SettingsAccordionProps) {
	const handleDoNotConvertBelowGramsChange = (e: ChangeEvent<HTMLInputElement>) => {
		//do not allow non-digit characters
		setDoNotConvertBelowGrams(e.target.value.replace(/[^\d]/gi, ''));
	};

	return (
		<SpacedAccordion toggleText='Advanced settings'>
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
				{/* NOTE: Disabling this until the egg conversion actually works
				YES I know that the best thing to do is to delete it 
				and retrieve it later from version control when i want to bring it back
				but if I do that I'll forget this exists since this is a side project

				 <div>
					<label>
					Convert egg amounts?
						<input id="convertEggs" type="checkbox" checked={convertEggs} onChange={(e) => setConvertEggs(e.target.checked)} />
					</label>
				</div> */}
				<p>Note: if the converter isn't detecting ingredients correctly, it may help to remove extraneous information or parentheticals from the ingredients list.</p>
			</div>
		</SpacedAccordion>);
}

const SpacedAccordion = styled(Accordion)`
	margin: 0.5em 0;
`;

export default SettingsAccordion;