

import {RouterProvider} from 'react-router-dom'
import route from "./router/Routes.jsx"
import './App.css'


function App() {
  return(
    <>

        <RouterProvider router={route}/>

    </>
  )
}

export default App
