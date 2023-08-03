import './App.css'
import { Route, Routes, BrowserRouter } from "react-router-dom";
import SignUp from './components/signup/Signup';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={ <SignUp />} />
          <Route path='/login' element={<>hi</>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
