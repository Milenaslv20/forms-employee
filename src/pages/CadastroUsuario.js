import React, { useState, useRef } from 'react'
import styles from './styles.module.css'
import Axios from 'axios'

import Modal from '../components/Modal'
import ModalError from '../components/ModalError'

function CadastroUsuario() {
  const endpoint = process.env.REACT_APP_API_BASE_URL;

  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [openModalError, setOpenModalError] = useState(false);
  const [modalMessageError, setModalMessageError] = useState('');

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senhaUsuario, setSenhaUsuario] = useState('');
  const [tipoAcesso, setTipoAcesso] = useState('');

  function modal(){
    setModalMessageError("Confirme o usuário")
    setOpenModalError(true)
  }

  const validateUser = async (usuario, senha) =>{
    try{
      const response = await Axios.post(`${endpoint}/validateUser`, { usuario, senha }, {
        method: 'POST',
        headers: { 
          "Content-Type": 'application/json', 
        }
      })

      if(response.data.success){
        setOpenModalError(false); // <-- FECHA o modal de erro
        cadastrarUsuario();  
      } 
    } catch (err){
      setModalMessageError("Usuário não autorizado");
      setOpenModalError(true);
    }
  }
  
  const cadastrarUsuario = async () =>{
    const formData = new FormData();
    formData.append("nomeUsuario", nomeUsuario);
    formData.append("senhaUsuario", senhaUsuario);
    formData.append("tipoAcesso", tipoAcesso);

    try{
      console.log("Enviando requisição...");
      const response = await Axios.post(`${endpoint}/cadastrarUsuario`, formData, {
        method: 'POST',
        headers: { 
          "Content-Type": 'application/json', 
        }
      })

      if(response.status === 200){
        setOpenModal(true);
        setModalMessage("Usuário cadastrado com sucesso");

        setNomeUsuario("");
        setSenhaUsuario("");
        setTipoAcesso("");
      } else {
        setOpenModalError(true)
        setModalMessageError("Erro ao enviar dados de cadastro do usuário")
      }
    } catch(err){
      setModalMessageError("Ocorreu um erro, tente novamente");
      console.error("Erro:", err);
    }
  }

  return (
    <div className={styles.container_cadastro_usuario}>
      <div className={styles.container_cad}>
        <div className={styles.container_inputs}>
          <h1>Cadastrar Usuário</h1>
          <input 
            autoFocus
            autoComplete='off'
            className={styles.input_nome}
            id='nomeUsuario'
            name='nomeUsuario'
            type='text'
            placeholder='Nome Usuário'
            maxLength={25}
            value={nomeUsuario}
            onChange={(e) => {setNomeUsuario(e.target.value)}}>
          </input>
          
          <div className={styles.container_inputs_cadastro}>
            <input 
              autoComplete='off'
              id='senhaUsuario'
              name='senhaUsuario'
              type='password'
              placeholder='Senha' 
              maxLength={8}
              value={senhaUsuario}
              onChange={(e) => {setSenhaUsuario(e.target.value)}}>
            </input>
            <label for="tipoAcesso">Tipo Acesso:</label>
            <select className={styles.container_inputs_select} id="tipoAcesso" name='tipoAcesso' value={tipoAcesso} onChange={e => setTipoAcesso(e.target.value)}>
              <option disabled={true} value="">Selecione</option>
              <option value='ADM'>ADM</option>
              <option value='Usuário'>Usuário</option>
            </select>
          </div>

          <button className={styles.button_send} id={styles.button_send_cad}  onClick={modal}>Enviar</button>
        </div>
      </div>
      <Modal openModal={openModal} setOpenModal={setOpenModal} message={modalMessage}/>
      <ModalError openModalError={openModalError} setOpenModalError={setOpenModalError} message={modalMessageError} onConfirmPassword={validateUser}/>
    </div>
  )
}

export default CadastroUsuario