import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { Link } from 'react-router-dom'

import { FilterX } from 'lucide-react'

function VisualizarLogsLogin() {
    const endpoint = process.env.REACT_APP_API_BASE_URL;

    const [dataLogsLogin, setdataLogsLogin] = useState([])

    const[filtroNomeUsuario, setFiltroNomeUsuario] = useState('')
    const [filtroDia, setFiltroDia] = useState('');
    const [filtroMes, setFiltroMes] = useState('');
    const [filtroAno, setFiltroAno] = useState('');
    const [filtroHora, setFiltroHora] = useState('');
    const [filtroMinuto, setFiltroMinuto] = useState('');
    const [filtroSegundo, setFiltroSegundo] = useState('');

    useEffect(() =>{
        const dataLogsLogin = async() =>{
        const reqData = await fetch(`${endpoint}/getLogsLogin`)
        const resData = await reqData.json()
        setdataLogsLogin(resData)
        }
        dataLogsLogin()
    }, [])

    const filtro = dataLogsLogin.filter(dataLogsLogin =>{
        const nomeUsuario = filtroNomeUsuario ? dataLogsLogin.nomeUsuario.toLowerCase().startsWith(filtroNomeUsuario.toLocaleLowerCase()) : true

        const [dia, mes, ano] = dataLogsLogin.dataLogin.split('/');
        const dataFiltraDia = filtroDia ? dia === filtroDia : true;
        const dataFiltraMes = filtroMes ? mes === filtroMes : true;
        const dataFiltraAno = filtroAno ? ano === filtroAno : true;

        const hora = filtroHora ? dataLogsLogin.horaLogin.startsWith(filtroHora) : true;
        const minuto = filtroMinuto ? dataLogsLogin.horaLogin.slice(3, 5).startsWith(filtroMinuto) : true;
        const segundo = filtroSegundo ? dataLogsLogin.horaLogin.slice(6, 8).startsWith(filtroSegundo) : true;
    
        return nomeUsuario && dataFiltraDia && dataFiltraMes && dataFiltraAno && hora && minuto && segundo
      })
    
      function clearFilters(){
        setFiltroNomeUsuario('')
        setFiltroDia('');
        setFiltroMes('');
        setFiltroAno('');
        setFiltroHora('')
        setFiltroMinuto('')
        setFiltroSegundo('')
    }

  return (
    <div>
        <div className={styles.container_register}>
            <div className={styles.nav_register}>
                <div className={styles.navigation_bar}>
                    <h1 className={styles.link_register}>Logs Login</h1>
                    <Link to={"/visualizarLogsEdicao"} className={styles.link_history}>Logs Edição</Link>
                </div>
            </div>
        </div>

        <div className={styles.filters_history}>
            <div className={styles.input_filters}>
                <input 
                    className={styles.input_filters_nome}
                    type='text'
                    id='nome'
                    name='nome'
                    placeholder='Nome Usuário'
                    maxLength={85}
                    onChange={(e) => setFiltroNomeUsuario(e.target.value)}
                    value={filtroNomeUsuario}
                    autoComplete='off'
                />
            </div>

            <div className={styles.input_filters2}>
                    <label>Data:</label>
                    <input 
                        className={styles.input_filters_hour}
                        type='text'
                        id='dia'
                        name='dia'
                        placeholder='Dia'
                        maxLength={2}
                        onChange={(e) => setFiltroDia(e.target.value)}
                        value={filtroDia}
                        autoComplete='off'
                    />

                    <input 
                        className={styles.input_filters_hour}
                        type='text'
                        id='mes'
                        name='mes'
                        placeholder='Mes'
                        maxLength={2}
                        onChange={(e) => setFiltroMes(e.target.value)}
                        value={filtroMes}
                        autoComplete='off'
                    />

                    <input 
                        className={styles.input_filters_hour}
                        type='text'
                        id='ano'
                        name='ano'
                        placeholder='Ano'
                        maxLength={2}
                        onChange={(e) => setFiltroAno(e.target.value)}
                        value={filtroAno}
                        autoComplete='off'
                />
            </div>

            <div className={styles.input_filters2}>
                <label>Horário:</label>
                <input 
                    className={styles.input_filters_hour}
                    type='text'
                    id='hora'
                    name='hora'
                    placeholder='Hora'
                    maxLength={2}
                    onChange={(e) => setFiltroHora(e.target.value)}
                    value={filtroHora}
                    autoComplete='off'
                />

                <input 
                    className={styles.input_filters_hour}
                    type='text'
                    id='minuto'
                    name='minuto'
                    placeholder='Min'
                    maxLength={2}
                    onChange={(e) => setFiltroMinuto(e.target.value)}
                    value={filtroMinuto}
                    autoComplete='off'
                />

                <input 
                    className={styles.input_filters_hour}
                    type='text'
                    id='segundo'
                    name='segundo'
                    placeholder='Seg'
                    maxLength={2}
                    onChange={(e) => setFiltroSegundo(e.target.value)}
                    value={filtroSegundo}
                    autoComplete='off'
                />
            </div>
            <FilterX className={styles.filter_icon} size={30} onClick={clearFilters}></FilterX>
            </div>

        <div className={styles.container_table}>
          <table className={styles.table} cellPadding={0} cellSpacing={0}>
            <thead>
                <tr>
                <th>Nome Usuário</th>
                <th>Data</th>
                <th>Hora</th>
                </tr>
            </thead>
            
            <tbody>
              { filtro.map((dataLogsLogin, idLog) =>(
              <tr key={idLog} className={styles.tr_data}>
              <td>{ dataLogsLogin.nomeUsuario }</td>
              <td>{ dataLogsLogin.dataLogin }</td>
              <td>{ dataLogsLogin.horaLogin }</td>
              </tr>
              ))
              }
            </tbody>
          </table>
        </div>
    </div>
  )
}

export default VisualizarLogsLogin