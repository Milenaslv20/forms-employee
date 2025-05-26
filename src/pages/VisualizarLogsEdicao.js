import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { Link } from 'react-router-dom'

import { FilterX } from 'lucide-react'

function VisualizarLogsEdicao() {
  const endpoint = process.env.REACT_APP_API_BASE_URL;

    const [dataLogsEdit, setdataLogsEdit] = useState([])

    const [filtroNomeUsuario, setFiltroNomeUsuario] = useState('');
    const [filtroTipoEdicao, setFiltroTipoEdicao] = useState('');
    const [filtroDia, setFiltroDia] = useState('');
    const [filtroMes, setFiltroMes] = useState('');
    const [filtroAno, setFiltroAno] = useState('');
    const [filtroHora, setFiltroHora] = useState('');
    const [filtroMinuto, setFiltroMinuto] = useState('');
    const [filtroSegundo, setFiltroSegundo] = useState('');
    
    useEffect(() =>{
        const dataLogsEdit = async() =>{
        const reqData = await fetch(`${endpoint}/getLogsEdit`)
        const resData = await reqData.json()
        setdataLogsEdit(resData)
        }
        dataLogsEdit()
    }, [])

    const filtro = dataLogsEdit.filter(dataLogsEdit =>{
        const nomeUsuario = filtroNomeUsuario ? dataLogsEdit.nomeUsuario.toLowerCase().startsWith(filtroNomeUsuario.toLocaleLowerCase()) : true

        const tipoEdicao = filtroTipoEdicao ? (dataLogsEdit.registroEditado || '').toLowerCase().includes(filtroTipoEdicao.toLowerCase()) : true;

        const [dia, mes, ano] = dataLogsEdit.dataEdit.split('/');
        const dataFiltraDia = filtroDia ? dia === filtroDia : true;
        const dataFiltraMes = filtroMes ? mes === filtroMes : true;
        const dataFiltraAno = filtroAno ? ano === filtroAno : true;

        const [hora, minuto, segundo] = dataLogsEdit.horaEdit.split(':');
        const horas = filtroHora ? hora === filtroHora : true;
        const minutos = filtroMinuto ? minuto === filtroMinuto : true;
        const segundos = filtroSegundo ? segundo === filtroSegundo : true;

        return nomeUsuario && tipoEdicao && dataFiltraDia && dataFiltraMes && dataFiltraAno && horas && minutos && segundos
      })
    
      function clearFilters(){
      setFiltroNomeUsuario('');
      setFiltroTipoEdicao('');
      setFiltroDia('');
      setFiltroMes('');
      setFiltroAno('');
      setFiltroHora('');
      setFiltroMinuto('');
      setFiltroSegundo('');
    }


  return (
    <div>
        <div className={styles.nav_register2}>
            <div className={styles.navigation_bar2}>
                <div className={styles.nav_history}>
                    <Link to={"/visualizarLogsLogin"} className={styles.link_register2}>Logs Login</Link>
                    <h1 className={styles.link_history2}>Logs Edição</h1>
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
            />
          </div>

          <div className={styles.input_filters}>
            <select
              className={styles.input_filters}
              id='tipoEdicao'
              name='tipoEdicao'
              onChange={(e) => setFiltroTipoEdicao(e.target.value)}
              value={filtroTipoEdicao}
            >
              <option value='' disabled>Tipo Edição</option>
              <option value='Cadastrou'>Cadastrou</option>
              <option value='Editou'>Editou</option>
              <option value='Excluiu'>Excluiu</option>
              <option value=''>-Limpar-</option>
            </select>
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
                <th>Registro Editado</th>
                <th>Data</th>
                <th>Hora</th>
                </tr>
            </thead>
            
            <tbody>
              { filtro.map((dataLogsEdit, idLog) =>(
              <tr key={idLog} className={styles.tr_data}>
              <td>{ dataLogsEdit.nomeUsuario }</td>
              <td>{ dataLogsEdit.registroEditado }</td>
              <td>{ dataLogsEdit.dataEdit }</td>
              <td>{ dataLogsEdit.horaEdit }</td>
              </tr>
              ))
              }
            </tbody>
          </table>
        </div>
    </div>
  )
}

export default VisualizarLogsEdicao