import { useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';

import Flow from './pages/Flow'
import CharacterEditor from './pages/CharacterEditor';
import StoryBatchEditor from './pages/StoryBatchEditor';


const useThemeDetector = (): ["dark" | "light", React.Dispatch<React.SetStateAction<"dark" | "light">>] => {
  const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)") ? "dark" : "light";
  const [themeMode, setThemeMode] = useState<"dark" | "light">(getCurrentTheme());  
  return [themeMode, setThemeMode];
}


export default function App() {

  const [themeMode, setThemeMode] = useThemeDetector();
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  const toggleMode = () => {
    setThemeMode(mode => mode === 'light' ? 'dark' : 'light');
  };

    const router = createBrowserRouter([
      {
        path: "/",
        element: <Flow toggleMode={toggleMode}/>,
      },
      {
        path: "/timeline",
        element: <Flow toggleMode={toggleMode}/>,
      },
      {
        path: "/characters",
        element: <CharacterEditor toggleMode={toggleMode} />
      },
      {
        path: "/storyBatches",
        element: <StoryBatchEditor toggleMode={toggleMode}/>
      },
    ]);
  
    return (
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    );
};
