import styled from 'styled-components';

export interface InfoPopoverProps {
    children: React.ReactNode
}

function InfoPopover({children}: InfoPopoverProps) {
	return (
		<>
			<SmallScreenOnly>
				{children}
			</SmallScreenOnly>
			<LargeScreenOnly>
				<Wrapper>
					<InfoText>
			(?)
						<InfoBox>{children}</InfoBox>
					</InfoText>
				</Wrapper>
			</LargeScreenOnly>
		</>
	);

}

//this is a rough breakpoint
// but the popolver will only 
const breakpoint = '600px';

const LargeScreenOnly = styled.span`
    display: none;
    @media (min-width: ${breakpoint}) {
        display: inline;
    }
`;

const SmallScreenOnly = styled.div`
    font-size: 10pt;
    @media (min-width: ${breakpoint}) {
        display: none;
    }
`;

const Wrapper = styled.span`
    position:relative;
`;

//info box will pop to the right at larger screen sizes
//and to the bottom on smaller screens
const InfoBox = styled.div`
    position: absolute;
    left: -130px;
    top: 1.5em;
    @media (min-width: 900px) {
        left: 1em;
        top: 0;
    }
    color: #1a1a1a;
    border: 1px solid #666;
    border-radius: 0.5em;
    padding: 3px;
    background-color: #fff;
    width: max-content;
    max-width: 300px;
    visibility: hidden;
    opacity: 0;
    transition: opacity .3s ease-in-out;
    font-size: 10pt;
    font-weight: normal;
    z-index: 1000;
`;

const InfoText = styled.a`
    cursor: pointer;
    width: fit-content;
    margin: 0 auto;
    font-size: 10pt;

    &:hover {
        ${InfoBox}{
            display: block;
            visibility: visible;
            opacity: 1;
        }
    }
`;



export default InfoPopover;