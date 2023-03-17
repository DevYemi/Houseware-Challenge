import { Route } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import HomeScreen from "../screens/HomeScreen";
import WordParseScreen from "../screens/WordParseScreen";
import ErrorScreen from '../screens/ErrorScreen';

export default function GetRoutes() {
   return (
      <>
         <Route
            path='/'
            element={
               <AppLayout>
                  <HomeScreen />
               </AppLayout>
            }
            errorElement={<ErrorScreen />}
         />

         <Route
            path='/word-parser'
            element={
               <AppLayout customWrapperStyles='h-max'>
                  <WordParseScreen />
               </AppLayout>
            }
            errorElement={<ErrorScreen />}
         />
      </>


   )
}