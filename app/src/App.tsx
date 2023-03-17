import './styles/App.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import GetRoutes from './utils/routes';



function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(GetRoutes())
  );

  return (
    <RouterProvider router={router} />
  )
}

export default App
