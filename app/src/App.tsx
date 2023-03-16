import { useState } from 'react'
import './styles/App.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import AppLayout from './components/AppLayout';
import ErrorScreen from './screens/ErrorScreen';
import WordParseScreen from './screens/WordParseScreen';



function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path='/'
          element={<AppLayout><HomeScreen /></AppLayout>}
          errorElement={<ErrorScreen />}
        />
        <Route
          path='/:userInput'
          element={<AppLayout customWrapperStyles='h-max'>
            <WordParseScreen />
          </AppLayout>}
          errorElement={<ErrorScreen />}
        />
      </>

    )
  );

  return (
    <RouterProvider router={router} />
  )
}

export default App
