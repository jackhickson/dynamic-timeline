import { useState } from 'react'

import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';
import Flow from './pages/Flow';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CharacterAliasEditor from './pages/CharacterAliasEditor';
import StoryBatchEditor from './pages/StoryBatchEditor';


export default() => {

    const [mode, setMode] = useState('light');
    const theme = mode === 'light' ? lightTheme : darkTheme;
  
    const toggleMode = () => {
      setMode((m) => (m === 'light' ? 'dark' : 'light'));
    };

    const router = createBrowserRouter([
      {
        path: "/",
        element: <Flow toggleMode={toggleMode}/>,
      },
      {
        path: "/characters",
        element: <CharacterAliasEditor toggleMode={toggleMode} />
      },
      {
        path: "/storyBatches",
        element: <StoryBatchEditor toggleMode={toggleMode}/>
      }
    ]);
  
    return (

      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    );
  };
