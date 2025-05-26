import React, { useEffect, useState } from 'react'
import styles from './stylesModule.module.css'
import { Link } from 'react-router-dom'
import Axios from 'axios'
import { useFuncionario } from './FuncionarioContext'

import Person from '../components/Person'

import Modal from '../components/Modal'
import ModalError from '../components/ModalError'

import { FilterX } from 'lucide-react'

function Historico ({ funcionarios }){
  const endpoint = process.env.REACT_APP_API_BASE_URL;

  const [dataFuncionarios, setDataFuncionarios] = useState([])
  const [totalFunc, setTotalFunc] = useState(0)

  const { usuario } = useFuncionario();

  const [data, setData] = useState('')

  const [deleteFuncionario, setDeleteFuncionario] = useState(null)
  const [filtros, setFiltros] = useState(funcionarios || [])

  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [openModalError, setOpenModalError] = useState(false);
  const [modalMessageError, setModalMessageError] = useState('');
  const [reload, setReload] = useState(false);

  const[filtroNome, setFiltroNome] = useState('')
  const[filtroSexo, setFiltroSexo] = useState('')
  const[filtroSetorDepartamento, setfiltroSetorDepartamento] = useState('')
  const[filtroVinculo, setFiltroVinculo] = useState('')

  //TODO: GET TOTALFUNC AND TOTAL DATA
  useEffect(() =>{
    const dataFuncionarios = async() =>{
      const reqData = await fetch(`${endpoint}/getRegisters`)
      const resData = await reqData.json()
      setDataFuncionarios(resData)
      setFiltros(resData || [])

      const reqTotal = await fetch(`${endpoint}/getRegisterstot`);
      const resTotal = await reqTotal.json();
      setTotalFunc(resTotal.totalFunc);
    }
    dataFuncionarios()
  }, [])

  //TODO: DELETE FUNC
  const handleOpenDeleteModal = (funcionario) =>{
    setDeleteFuncionario(funcionario)
    setOpenModalError(true)
    setModalMessageError(`O registro ${funcionario.nomeFuncionario} será excluido`)
  }


  const confirmedDeleteFunc = async () =>{
    try{

      if(deleteFuncionario){
        const res = await fetch(`${endpoint}/deleteRegister/${deleteFuncionario.idFuncionario}`, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            nome: deleteFuncionario.nomeFuncionario
          }),
        })

        const exclusao = `Excluiu registro ${deleteFuncionario.nomeFuncionario}`
        const resLogEdit = await Axios.post(`${endpoint}/logEdicao`, {
          nomeUsuario: usuario,
          nomeFuncionario: exclusao
        });
      
        if (res.status && resLogEdit.status === 200) {
            setOpenModalError(false)
            setOpenModal(true)
            setModalMessage(`O registro ${deleteFuncionario.nomeFuncionario} foi excluido com sucesso`)
            setFiltros(prevFiltros => prevFiltros.filter(func => func.idFuncionario !== deleteFuncionario.idFuncionario));
            setTotalFunc(prevTotal => prevTotal -1)
        } else{
          setOpenModalError(true)
          setModalMessageError("falha ao excluir")
        }
      }
    } catch (error) {
      console.error('Erro ao tentar excluir funcionário:', error);
    }
  }

  //TODO: FILTERS
  const filtro = filtros.filter(funcionario =>{
    const nomeFunc = filtroNome ? funcionario.nomeFuncionario.toLowerCase().startsWith(filtroNome.toLocaleLowerCase()) : true
    const sexoFunc = filtroSexo ? funcionario.sexo.toLowerCase().startsWith(filtroSexo.toLocaleLowerCase()) : true
    const setorFunc = filtroSetorDepartamento ? funcionario.setorDepartamento.toLowerCase().startsWith(filtroSetorDepartamento.toLocaleLowerCase()) : true
    const vinculoFunc = filtroVinculo ? funcionario.vinculo.toLowerCase().startsWith(filtroVinculo.toLocaleLowerCase()) : true

    return nomeFunc & sexoFunc & setorFunc & vinculoFunc
  })

  function clearFilters(){
    setFiltroNome('')
    setFiltroSexo('')
    setfiltroSetorDepartamento('')
    setFiltroVinculo('')
  }


  return (
    <div>
      <div className={styles.nav_register2}>
        <div className={styles.navigation_bar2}>
          <div className={styles.nav_history}>
            <Link to={"/registro"} className={styles.link_register2}>Registrar Funcionário</Link>
            <h1 className={styles.link_history2}>Histórico Funcionários</h1>
          </div>

          <div className={styles.filters_history}>
            <div className={styles.totalFunc}>
              <span>Total de Funcionários: {totalFunc}</span>
            </div>

            <div className={styles.input_filters}>
              <input 
                className={styles.input_filters_nome}
                type='text'
                id='nome'
                name='nome'
                placeholder='Nome'
                maxLength={85}
                onChange={(e) => setFiltroNome(e.target.value)}
                value={filtroNome}
              />
            </div>

            <div className={styles.input_filters}>
              <select id='sexo' name='sexo' onChange={(e) => setFiltroSexo(e.target.value)} value={filtroSexo}>
                <option disabled={true} value="">Sexo</option>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="Outros">Outros</option>
                <option value="NI">NI</option>
                <option value="">-Limpar-</option>
              </select>
            </div>

            <div className={styles.input_filters}>
              <select id='setorDepartamento' name='setorDepartamento' onChange={(e) => setfiltroSetorDepartamento(e.target.value)} value={filtroSetorDepartamento}>
                <option disabled={true} value="">Setor/Departamento</option>
                <option value="Outros">Outros</option>
                <option value="">-Limpar-</option>
              </select>
            </div>

            <div className={styles.input_filters} onChange={(e) => setFiltroVinculo(e.target.value)} value={filtroVinculo}>
              <select id='vinculo' name='vinculo'>
                <option disabled={true} value="">Vínculo</option>
                <option value="Temporário">Temporário</option>
                <option value="">-Limpar-</option>
              </select>
            </div>

            <FilterX className={styles.filter_icon} size={30} onClick={clearFilters}></FilterX>
          </div>
        </div>

        <div className={styles.container_people}>
          {filtro.length > 0 ?(
            filtro.map((funcionario) =>(
              <Person key={funcionario.id} funcionario={funcionario} handleOpenDeleteModal={handleOpenDeleteModal} parenttochild={data}/>
            ))
          ) : (
            <p className={styles.error_msg}>Nenhum funcionário encontrado</p>
          )}
        </div>
      </div>
      
      <Modal openModal={openModal} setOpenModal={setOpenModal} message={modalMessage} />
      <ModalError openModalError={openModalError} setOpenModalError={setOpenModalError} message={modalMessageError} reload={reload} onConfirm={confirmedDeleteFunc}/>
    </div>
  )
}

export default Historico