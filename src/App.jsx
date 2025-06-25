import { BrowserRouter } from "react-router-dom"
import DashRoutes from "./routes/DashRoutes"
import React from 'react'

const App = () => {
  return (
    <BrowserRouter>
      <DashRoutes />
    </BrowserRouter>
  )
}

export default App
