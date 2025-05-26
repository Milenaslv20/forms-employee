import React, { useState, useEffect } from 'react';
import styles from '../pages/stylesModule.module.css'

export default function ModalError({openModalError, setOpenModalError, message, reload, onConfirm, onConfirmPassword}) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');


  useEffect(() => {
    if (openModalError) {
      setUsuario('');
      setSenha('');
    }
  }, [openModalError]);

  if (!openModalError) return null;

  const handleClose = () => {
    setOpenModalError(false);
    if (reload) window.location.reload();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setOpenModalError(false);
  };

  const handleConfirmPassword = () => {
    if (onConfirmPassword) onConfirmPassword(usuario, senha);
    setUsuario('');
    setSenha('');
  };

  if(openModalError){
    return (
      <div className={styles.modal_overlay_error}>
        <div className={styles.modal_content_error}>
          <button onClick={handleClose} className={styles.close_button_error}><span>X</span></button>
          <h1>{message}</h1>

          {onConfirm && (
            <button onClick={handleConfirm} className={styles.confirm_button}>Confirmar</button>
          )}

          {onConfirmPassword  && message === "Confirme o usuário" &&  (
            <div className={styles.container_confirm_user}>
              <input 
                autoComplete='off'
                className={styles.inputsss} 
                placeholder='Usuário'
                type='text'
                name='usuario'
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}>
              </input>

              <input 
                autoComplete='off'
                className={styles.inputsss} 
                placeholder='Senha'
                type='password'
                name='senha'
                value={senha}
                onChange={(e) => setSenha(e.target.value)}>
              </input>
              <button className={styles.inputsss} onClick={handleConfirmPassword}>Confirmar</button>
            </div>
          )}
        </div>
      </div>
    )
  }
}
