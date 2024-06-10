import styled from 'styled-components';

const PageBackground = styled.div`
    height: 100vh;
    background: ${(props) => props.theme.nodeBg};
`;

export default function EditorPage({children} : any) {

    return(
        <PageBackground>
            {children}
        </PageBackground>
    )
}