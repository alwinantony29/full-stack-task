import './App.css'
import { Route, Routes, BrowserRouter } from "react-router-dom";
import SignUp from './components/signup/Signup';
import Login from './components/login/Login';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
