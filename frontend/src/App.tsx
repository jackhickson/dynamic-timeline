import { useState } from 'react'
import Flow from './pages/Flow'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';


export default function App() {

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
        path: "/timeline",
        element: <Flow toggleMode={toggleMode}/>,
      },
    ]);
  
    return (
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    );
};
