import styled from 'styled-components';

export interface InfoPopoverProps {
    children: React.ReactNode
}

function InfoPopover({children}: InfoPopoverProps) {
	return (
		<Wrapper>
			<InfoText>
			(?)
				<InfoBox>{children}</InfoBox>
			</InfoText>
		</Wrapper>);

}

/* TODO need to handle mobile (ie cannot hover) */

const Wrapper = styled.span`
    position:relative;
`;

const InfoBox = styled.div`
    position: absolute;
    left: 1em;
    top: 0;
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