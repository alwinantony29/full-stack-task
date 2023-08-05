import './App.css'
import { Route, Routes, BrowserRouter } from "react-router-dom";
import SignUp from './components/signup/Signup';
import Login from './components/login/Login';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import PDFviewer from './components/PDFviewer';

function App() {

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/pdf/:pdfID' element={<PDFviewer/>} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
