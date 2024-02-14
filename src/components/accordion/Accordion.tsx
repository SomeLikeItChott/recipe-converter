import { useState } from 'react';
import styled, {css} from 'styled-components';

export interface AccordionProps {
	toggleText: string;
	children: React.ReactNode;
	className?: string;
}

function Accordion({ children, toggleText, className}: AccordionProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const handleToggle = () => setIsOpen(!isOpen);

	return (
		<AccordionWrapper className={className}>
			<ToggleLink onClick={handleToggle}>{toggleText} <Caret $isOpen={isOpen}>^</Caret></ToggleLink>
			<ContentWrapper $isOpen={isOpen}>
				{children}
			</ContentWrapper>
		</AccordionWrapper>
	);
}

const AccordionWrapper = styled.div`
	position: relative;
`;

/*
	Note: this accordion works on the assumption that 
	its content will never be larger than 20em. 
	that's a bad assumption! TODO fix it
*/
const ContentWrapper = styled.div<{ $isOpen: boolean; }>`
	transition: 0.4s ease;
	overflow: hidden;
	max-height: 0;
	${props =>
		props.$isOpen &&
		css`
			max-height: 20em;
		`};
`;

const Caret = styled.span<{ $isOpen: boolean; }>`
	display: inline-block;
	position: relative;
	top: 0;
	transition: 0.4s ease;
	transform: rotate(180deg);
	${props =>
		props.$isOpen &&
		css`
		top: 4px;
		transform: rotate(0deg);
		`};
`;

const ToggleLink = styled.a`
	cursor: pointer;
`;

export default Accordion;