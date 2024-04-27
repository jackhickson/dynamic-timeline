import { useState } from 'react'

import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';
import Flow from './pages/Flow';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CharacterEditor from './pages/CharacterEditor';
import StoryBatchEditor from './pages/StoryBatchEditor';
import { ReactFlowProvider } from 'reactflow';
import ImportTimeline from './pages/ImportTimeline';


export default() => {

    const [mode, setMode] = useState('light');
    const theme = mode === 'light' ? lightTheme : darkTheme;
  
    const toggleMode = () => {
      setMode((m) => (m === 'light' ? 'dark' : 'light'));
    };

    const router = createBrowserRouter([
      {
        path: "/",
        element: <ReactFlowProvider><Flow toggleMode={toggleMode}/></ReactFlowProvider>,
      },
      {
        path: "/timeline",
        element: <ReactFlowProvider><Flow toggleMode={toggleMode}/></ReactFlowProvider>,
      },
      {
        path: "/characters",
        element: <CharacterEditor toggleMode={toggleMode} />
      },
      {
        path: "/storyBatches",
        element: <StoryBatchEditor toggleMode={toggleMode}/>
      },
      {
        path: "/importTimeline",
        element: <ImportTimeline toggleMode={toggleMode}/>
      }
    ]);
  
    return (

      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    );
  };
