import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FuncionarioProvider } from './pages/FuncionarioContext';

import Login from './pages/Login';
import Registro from './pages/Registro';
import Historico from './pages/Historico';
import Editar from './pages/Editar';
import Visualizar from './pages/Visualizar';
import VisualizarLogsLogin from './pages/VisualizarLogsLogin';
import VisualizarLogsEdicao from './pages/VisualizarLogsEdicao';
import CadastroUsuario from './pages/CadastroUsuario';

const PrivateRoute = ({ element, isAuth, onLogin }) => {
  const location = useLocation();

  if (isAuth){
    return React.cloneElement(element, { onLogin })
  }
  else{
    return <Navigate to="/" state={{ from: location.pathname }} />;
  }
}

function App() {
  const [isAuth, setIsAuth] = useState(false)
  
  const handleLogin = (token) =>{
    sessionStorage.setItem('token', token);
    setIsAuth(true)
  }

  const logout = () =>{
    sessionStorage.removeItem('token')
    setIsAuth(false)
  }

  useEffect(() =>{
    const token = sessionStorage.getItem('token')
    if (!token || token.length < 5){
      logout()
    }
    else{
      setIsAuth(true)
    }
  }, [])

  return (
    <FuncionarioProvider>
      <Router>
        <Routes>
          <Route exact path='/' element={<Login onLogin={handleLogin} /> }/>
          <Route path='/registro' element={<PrivateRoute element={<Registro/>} isAuth={isAuth} />} />
          <Route path='/historico' element={<PrivateRoute element={<Historico/>} isAuth={isAuth} />} />
          <Route path='/editar' element={<PrivateRoute element={<Editar/>} isAuth={isAuth} />} />
          <Route path='/visualizar' element={<PrivateRoute element={<Visualizar/>} isAuth={isAuth} />} />
          <Route path='/visualizarLogsLogin' element={<PrivateRoute element={<VisualizarLogsLogin/>} isAuth={isAuth} />} />
          <Route path='/visualizarLogsEdicao' element={<PrivateRoute element={<VisualizarLogsEdicao/>} isAuth={isAuth} />} />
          <Route path='/cadastroUsuario' element={<PrivateRoute element={<CadastroUsuario/>} isAuth={isAuth} />} />
        </Routes>
      </Router>  
    </FuncionarioProvider>
  );
}

export default App;
