import Flow from './pages/Flow'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';


export default function App() {

    const router = createBrowserRouter([
      {
        path: "/",
        element: <Flow />,
      },
      {
        path: "/timeline",
        element: <Flow/>,
      },
    ]);
  
    return (
      <RouterProvider router={router} />
    );
};
