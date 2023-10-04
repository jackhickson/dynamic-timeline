import { useState } from 'react'
import {Panel} from 'reactflow';

import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';
import Flow from './Flow';


export default() => {

    const [mode, setMode] = useState('dark');
    const theme = mode === 'light' ? lightTheme : darkTheme;
  
    const toggleMode = () => {
      setMode((m) => (m === 'light' ? 'dark' : 'light'));
    };
  
    return (

      <ThemeProvider theme={theme}>
        <Flow>
          <Panel position="top-left">
            <button onClick={toggleMode}>switch mode</button>
          </Panel>
        </Flow>
      </ThemeProvider>
    );
  };
