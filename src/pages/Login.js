import React, { useState } from 'react'
//import styles from './styles.module.css'
import '../styles/styles-login.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { isAuth } from '../isAuth';
import { useFuncionario } from './FuncionarioContext'

import logo from '../svg/logo.svg'

import ModalError from '../components/ModalError';

function Login({ onLogin }) {

  const[nomeUsuario, setNomeUsuario] = useState('')
  const[senhaUsuario, setSenhaUsuario] = useState('')
  const[openModalError, setOpenModalError] = useState(false)
  const[modalMessageError, setModalMessageError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const { setUsuario } = useFuncionario();

  const from = location.state?.from || '/registro'

  function enterPress(e){
    if(e.key === 'Enter'){
        handleLogin(e)
    }
  }

  const handleLogin = async (e) =>{
    e.preventDefault();
      const res = await isAuth(nomeUsuario, senhaUsuario)
      if (res.sucess){
        localStorage.setItem('token', res.token, nomeUsuario)
        localStorage.setItem('nomeUsuario', nomeUsuario)
        onLogin(res.token)
        setUsuario(nomeUsuario);
        navigate(from);
        //navigate("/registro", { state: { usuario: usuario } });
      }
      else{
        setModalMessageError("Usuário ou senha incorretos")
        setOpenModalError(true)
        setNomeUsuario("")
        setSenhaUsuario("")
        document.getElementById("usuario").focus()
      }
    }

  return (
    <div>
      <div className="container_left">
        <h1>Registro de Funcionários</h1>

        <img src={logo} alt=''/>
      </div>

      <div className="container_right">
        <div className="container_login">
          <h1>Login</h1>

          <input id='usuario' type='text' placeholder='Usuário' maxLength={25} autoComplete='off' value={nomeUsuario} onChange={(e) => {setNomeUsuario(e.target.value)}}></input>
          <input id="input_password" type='password' placeholder='Senha' maxLength={8} autoComplete='off' value={senhaUsuario} onChange={(e) => {setSenhaUsuario(e.target.value)}} onKeyPress={enterPress}></input>
          <button className="button_login" onClick={handleLogin}>Entrar</button>
        </div>
      </div>
      <ModalError openModalError={openModalError} setOpenModalError={setOpenModalError} message={modalMessageError}/>
    </div>
  )
}

export default Login