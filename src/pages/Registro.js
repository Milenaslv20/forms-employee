import React, { useState, useRef } from 'react'
import stylesModule from './stylesModule.module.css'
import '../styles/styles-registro.css'
import { Link } from 'react-router-dom'
import Axios from 'axios'
import { useFuncionario } from './FuncionarioContext'
import { IMaskInput } from 'react-imask';

import { Paperclip } from 'lucide-react'

import Modal from '../components/Modal'
import ModalError from '../components/ModalError'

function Registro() {
  const endpoint = process.env.REACT_APP_API_BASE_URL;

  //TODO: DECLARATION MODAL
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [openModalError, setOpenModalError] = useState(false);
  const [modalMessageError, setModalMessageError] = useState('');
  const [reload, setReload] = useState(false);

  const { usuario } = useFuncionario();

  //TODO: INPUT VALUES
  const [idFuncionario, setIdFuncionario] = useState(null)
  const [imagem, setImagem] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef(null);
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [data_nasc, setDataNasc] = useState('');
  const [estadoAtual, setEstadoAtual] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [naturalidade, setNaturalidade] = useState('');
  const [raca, setRaca] = useState('');
  const [telefone, setTelefone] = useState('(92)');
  const [email, setEmail] = useState('');

  const [nomePai, setNomePai] = useState('');
  const [nomeMae, setNomeMae] = useState('');


  const [estadoCivil, setEstadoCivil] = useState('');
  const [nomeEsposoa, setNomeEsposoa] = useState('');
  const [filhos, setFilhos] = useState('');
  const [nomeFilhos, setNomeFilhos] = useState('');

  const [logadouro, setLogadouro] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidades, setCidades] = useState([])
  const estadosCidades = {
    "Amazonas" : ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga", "Maués", "São Gabriel da Cachoeira",
      "Humaitá", "Lábrea", "Borba", "Autazes", "Manicoré", "Careiro", "Presidente Figueiredo", "Nova Olinda do Norte", "Boca do Acre",
      "Iranduba", "Barreirinha"],
    "Acre" : ["Acrelândia", "Assis Brasil", "Brasiléia", "Bujari", "Capixaba", "Cruzeiro do Sul", "Epitaciolândia", "Feijó", "Jordão",
      "Mâncio Lima", "Manoel Urbano", "Marechal Thaumaturgo", "Plácido de Castro", "Porto Acre", "Porto Walter", "Rio Branco", "Rodrigues Alves",
      "Santa Rosa do Purus", "Sena Madureira", "Senador Guiomard", "Tarauacá","Xapuri"],  
    "Alagoas" : ["Água Branca", "Anadia", "Arapiraca", "Atalaia", "Barra de Santo Antônio", "Barra de São Miguel", "Batalha", "Belém",
      "Belo Monte", "Boca da Mata", "Branquinha", "Cacimbinhas", "Cajueiro", "Campestre", "Campo Alegre", "Campo Grande", "Canapi",
      "Capela", "Carneiros", "Chã Preta", "Coité do Nóia", "Colônia Leopoldina", "Coqueiro Seco", "Coruripe", "Craíbas", "Delmiro Gouveia",
      "Dois Riachos", "Estrela de Alagoas", "Feira Grande", "Feliz Deserto", "Flexeiras", "Girau do Ponciano", "Ibateguara", "Igaci", "Igreja Nova",
      "Inhapi", "Jacaré dos Homens", "Jacuípe", "Japaratinga", "Jaramataia", "Jequiá da Praia", "Joaquim Gomes", "Jundiá", "Junqueiro",
      "Lagoa da Canoa", "Limoeiro de Anadia", "Maceió", "Major Isidoro", "Mar Vermelho", "Maragogi", "Maravilha", "Marechal Deodoro",
      "Maribondo", "Mata Grande", "Matriz de Camaragibe", "Messias", "Minador do Negrão", "Monteirópolis", "Murici", "Novo Lino",
      "Olho d'Água das Flores", "Olho d'Água do Casado", "Olho d'Água Grande", "Olivença", "Ouro Branco", "Palestina", "Palmeira dos Índios",
      "Pão de Açúcar", "Pariconha", "Paripueira", "Passo de Camaragibe", "Paulo Jacinto", "Penedo", "Piaçabuçu", "Pilar", "Pindoba",
      "Piranhas", "Poço das Trincheiras", "Porto Calvo", "Porto de Pedras", "Porto Real do Colégio", "Quebrangulo", "Rio Largo",
      "Roteiro", "Santa Luzia do Norte", "Santana do Ipanema", "Santana do Mundaú", "São Brás", "São José da Laje", "São José da Tapera",
      "São Luís do Quitunde", "São Miguel dos Campos", "São Miguel dos Milagres", "São Sebastião", "Satuba", "Senador Rui Palmeira",
      "Tanque d'Arca", "Taquarana", "Teotônio Vilela", "Traipu", "União dos Palmares", "Viçosa"],
    "Amapá" : ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Porto Grande", "Mazagão", "Tartarugalzinho", "Vitória do Jari",
      "Calçoene", "Ferreira Gomes", "Cutias", "Itaubal", "Serra do Navio", "Pracuúba"],   
    "Bahia" : ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna", "Juazeiro", "Lauro de Freitas", "Ilhéus",
      "Jequié", "Teixeira de Freitas", "Alagoinhas", "Barreiras", "Porto Seguro", "Simões Filho"],  
    "Ceará" : ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá",
      "Pacatuba", "Canindé", "Aquiraz", "Crateús", "Pacajus", "Quixeramobim"],  
    "Espírito Santo" : ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares", "Colatina", "Guarapari", "Aracruz", "São Mateus",
      "Viana", "Nova Venécia", "Barra de São Francisco", "Santa Maria de Jetibá"],  
    "Goiás" : ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás",
      "Trindade", "Formosa", "Novo Gama", "Catalão", "Itumbiara", "Jataí", "Senador Canedo", "Caldas Novas"],  
    "Maranhão" : ["São Luís", "Imperatriz", "Caxias", "Timon", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Barra do Corda",
      "Pinheiro", "Santa Inês", "Chapadinha", "Itapecuru-Mirim"],  
    "Mato Grosso" : ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Cáceres", "Sorriso", "Lucas do Rio Verde",
      "Primavera do Leste", "Barra do Garças", "Alta Floresta", "Pontes e Lacerda"],  
    "Mato Grosso do Sul" : ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Naviraí", "Nova Andradina", "Aquidauana",
      "Sidrolândia", "Paranaíba", "Coxim", "Maracaju", "Rio Brilhante", "Amambai"],  
    "Minas Gerais" : ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba",
      "Governador Valadares", "Ipatinga", "Sete Lagoas", "Divinópolis", "Poços de Caldas"],  
    "Pará" : ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal", "Parauapebas", "Abaetetuba", "Cametá", "Bragança", "Marituba",
      "Itaituba", "Altamira", "Tucuruí", "Barcarena", "Breves"],  
    "Paraíba" : ["João Pessoa", "Campina Grande", "Santa Rita","Patos", "Bayeux", "Sousa", "Cabedelo", "Cajazeiras", "Guarabira", "Sapé",
      "Mamanguape", "Queimadas", "São Bento", "Monteiro", "Esperança"],  
    "Paraná" : ["Curitiba","Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava",
      "Paranaguá", "Toledo", "Apucarana", "Pinhais", "Araucária"],  
    "Pernambuco" : ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe",
      "Garanhuns", "Vitória de Santo Antão", "Igarassu", "São Lourenço da Mata"],  
    "Piauí" : ["Teresina", "Parnaíba", "Picos", "Floriano", "Piripiri", "Campo Maior", "Barras", "Altos", "José de Freitas", "União",
      "Pedro II", "Esperantina", "Oeiras"],  
    "Rio de Janeiro" : ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "Campos dos Goytacazes",
      "Petrópolis", "Volta Redonda", "Macaé", "Angra dos Reis"],  
    "Rio Grande do Norte" : ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba", "Ceará-Mirim", "Caicó", "Açu", "Currais Novos",
      "São José de Mipibu", "Santa Cruz", "Nova Cruz"],  
    "Rio Grande do Sul" : ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo","São Leopoldo",
      "Rio Grande", "Alvorada", "Passo Fundo", "Sapucaia do Sul"],  
    "Rondônia" : ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura", "Jaru", "Guajará-Mirim"],  
    "Roraima" : ["Boa Vista", "Rorainópolis", "Caracaraí", "Mucajaí", "Alto Alegre", "Pacaraima", "Amajari", "Bonfim"],  
    "Santa Catarina" : ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó", "Criciúma", "Itajaí", "Jaraguá do Sul", "Palhoça",
      "Lages", "Balneário Camboriú", "Brusque", "Tubarão"],  
    "São Paulo" : ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "Osasco", "São José dos Campos", "Ribeirão Preto",
      "Sorocaba", "Mauá", "São José do Rio Preto", "Mogi das Cruzes"],  
    "Sergipe" : ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "Estância", "Tobias Barreto", "Itabaianinha", "Simão Dias",
      "Nossa Senhora da Glória", "Poço Redondo", "Capela", "Propriá"],  
    "Tocantins" : ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Guaraí", "Colinas do Tocantins", "Dianópolis",
      "Tocantinópolis", "Augustinópolis"]  
  }
  const [estadoSelecionado, setEstadoSelecionado] = useState('')
  const [cidadeSelecionada, setCidadeSelecionada] = useState('')

  const [escolaridade, setEscolaridade] = useState('')
  const [cursos, setCursos] = useState('')
  const [curso1, setCurso1] = useState('')
  const [curso2, setCurso2] = useState('')
  const [curso3, setCurso3] = useState('')
  const [curso4, setCurso4] = useState('')

  const [funcao, setFuncao] = useState('')
  const [contrato, setContrato] = useState('')
  const [setor, setSetor] = useState('')


  //TODO: INPUT CIDADES
  const handleEstados = (e) =>{
    const estadoSelecionado = e.target.value;
    setEstadoSelecionado(estadoSelecionado);

    if(estadoSelecionado && estadosCidades[estadoSelecionado]){
      setCidades(estadosCidades[estadoSelecionado]);
    } else{
      setCidades([])
    }
  }

  const handleCidade = (e) =>{
    setCidadeSelecionada(e.target.value)
  }

  //TODO: INPUT IMAGE
  const handleImageChange = (e) =>{
    const file = e.target.files[0];
    if (file) {
      setImagem(file);

      // Criar URL de visualização da imagem
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);  // Armazena a URL da imagem no estado
      };
      reader.readAsDataURL(file);  // Lê o arquivo como URL de dados
    }
  };

  //TODO: VERIFICATION USER
    const verificarUsuario = async (cpf) =>{
      try{
        const response = await Axios.post(`${endpoint}/existenciaUsuario`, { cpf }, {
          method: 'POST',
          headers: { 
            "Content-Type": 'application/json', 
          }
        })
  
        if(response.data.success){
          setOpenModalError(true);
          setModalMessageError("O Funcionário já está cadastrado")
        } 
      } catch (err){
      }
    }

  //TODO: VALIDATION INPUTS AND SEND TO BACKEND
  const regex = /[0-9!#$%&'"()*+,-./:;?@[\\\]_`{|}~]/

  const validateForm = () =>{
    if(nome === ''){
      setModalMessageError("Preencha o nome")
      setOpenModalError(true)
      return false;
    }
    if(regex.test(nome) === true){
      setModalMessageError("Preencha o nome apenas com letras")
      setOpenModalError(true)
      return false;
    }

    if(sexo === ''){
      setModalMessageError("Preencha o sexo")
      setOpenModalError(true)
      return false;
    }

    if(data_nasc === ''){
      setModalMessageError("Peencha a data de nascimento")
      setOpenModalError(true)
      return false;
    }

    if(estadoAtual === ''){
      setModalMessageError("Preencha o estado")
      setOpenModalError(true)
      return false;
    }

    if(nacionalidade.trim() === ''){
      setModalMessageError("Preencha a nacionalidade")
      setOpenModalError(true)
      return false;
    }
    if(regex.test(nacionalidade) === true){
      setModalMessageError("Preencha a nacionalidade apenas com letras")
      setOpenModalError(true)
      return false;
    }

    if(naturalidade.trim() === ''){
      setModalMessageError("Preencha a naturalidade")
      setOpenModalError(true)
      return false;
    }
    if(regex.test(naturalidade) === true){
      setModalMessageError("Preencha a naturalidade apenas com letras")
      setOpenModalError(true)
      return false;
    }

    if(raca === ''){
      setModalMessageError("Preencha a raça")
      setOpenModalError(true)
      return false;
    }

    if(telefone.trim() === ''){
      setModalMessageError("Digite o telefone")
      setOpenModalError(true)
      return false;
    }

    if(nomePai.trim() === ''){
      setModalMessageError("Preencha o nome do pai")
      setOpenModalError(true)
      return false;
    }
    if(regex.test(nomePai) === true){
      setModalMessageError("Preencha o nome do pai apenas com letras")
      setOpenModalError(true)
      return false;
    }

    if(nomeMae.trim() === ''){
      setModalMessageError("Preencha o nome da mãe")
      setOpenModalError(true)
      return false;
    }
    if(regex.test(nomeMae) === true){
      setModalMessageError("Preencha o nome da mãe apenas com letras")
      setOpenModalError(true)
      return false;
    }

    if(estadoCivil === ''){
      setModalMessageError("Preencha o Estado Civil")
      setOpenModalError(true)
      return false;
    }

    if(filhos === ''){
      setModalMessageError("Preencha a quantidade de filhos")
      setOpenModalError(true)
      return false;
    }

    if(bairro.trim() === ''){
      setModalMessageError("Preencha o Bairro")
      setOpenModalError(true)
    }

    if(logadouro.trim() === ''){
      setModalMessageError("Preencha o Logadouro")
      setOpenModalError(true)
      return false;
    }

    if(escolaridade.trim() === ''){
      setModalMessageError("Preencha a Escolaridade")
      setOpenModalError(true)
      return false;
    }

    if(cursos.trim() === ''){
      setModalMessageError("Preencha a quantidade de cursos")
      setOpenModalError(true)
      return false;
    }

    if(cursos.trim() === ''){
      setModalMessageError("Preencha a quantidade de cursos")
      setOpenModalError(true)
      return false;
    }
    return true
  }

  const submitForm = async () => {
    const isValidInputs = validateForm();

    if(!isValidInputs){
      return;
    }

    const emptyInputs = (value) =>{
      return value.trim() === '' ? 'Não Possui' : value;
    }

    const emptyInputsCpf = (value) =>{
      return value.trim() === '' ? '000.000.000-00' : value;
    }

    const emptyInputsDate = (value) =>{
      if (!value || typeof value !== 'string') return '1111-01-01';
      return value.trim() === '' ? '1111-01-01' : value;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("sexo", sexo);
    formData.append("data_nasc", data_nasc);
    formData.append("estadoAtual", estadoAtual);
    formData.append("nacionalidade", nacionalidade);
    formData.append("naturalidade", naturalidade);
    formData.append("raca", raca);
    formData.append("telefone", telefone);
    formData.append("email", emptyInputs(email));
      
    formData.append("nomePai", nomePai);
    formData.append("nomeMae", nomeMae);
    formData.append("estadoCivil", estadoCivil);
    formData.append("nomeEsposoa", emptyInputs(nomeEsposoa));
    formData.append("filhos", filhos);
    formData.append("nomeFilhos", emptyInputs(nomeFilhos));
      
    formData.append("bairro", bairro);
    formData.append("logadouro", logadouro);
    formData.append("cidadeSelecionada", cidadeSelecionada);
    formData.append("estadoSelecionado", estadoSelecionado);
      
    formData.append("escolaridade", escolaridade);
    formData.append("cursos", cursos);
    formData.append("curso1", emptyInputs(curso1));
    formData.append("curso2", emptyInputs(curso2));
    formData.append("curso3", emptyInputs(curso3));
    formData.append("curso4", emptyInputs(curso4));

    formData.append("funcao", emptyInputs(funcao));
    formData.append("contrato", contrato);
    formData.append("setor", emptyInputs(setor));


    //TODO: SEND TO BACKEND
    try{
      console.log("Enviando requisição...");

      // 1. Cadastro
      const response = await Axios.post(`${endpoint}/cadastrar`, formData, {
        headers: { 
          "Content-Type": 'application/json', 
        }
      })

      const idFuncionario = response.data.idFuncionario
      console.log("ID do funcionário recebido do cadastro:", idFuncionario);
      setIdFuncionario(idFuncionario)
 
      const formDatas = new FormData();
      formDatas.append('idFuncionario', idFuncionario)
      formDatas.append('nome', nome)

      if(imagem) {
        formDatas.append('imagem', imagem)
      }

      // 2. Upload
      const uploadRes = await Axios.post(`${endpoint}/uploads`, formDatas, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const cadastro = `Cadastrou registro ${nome}`
      const resLogEdit = await Axios.post(`${endpoint}/logEdicao`, {
        nomeUsuario: usuario,
        nomeFuncionario: cadastro
      });


      if (uploadRes.status && response.status && resLogEdit.status === 200){
        console.log(formData)
        
        setOpenModal(true);
        setModalMessage("Funcionário cadastrado com sucesso");

        setSelectedImage(null);
        setNome("");
        setSexo("");
        setDataNasc("");
        setEstadoAtual("");
        setNacionalidade("");
        setNaturalidade("");
        setRaca("");
        setTelefone("(92)");
        setEmail("");

        setNomePai("");
        setNomeMae("");

        setEstadoCivil("");
        setNomeEsposoa("");
        setFilhos("");
        setNomeFilhos("");

        setLogadouro("");
        setBairro("");
        setEstadoSelecionado("");
        setCidadeSelecionada("");

        setEscolaridade("");
        setCursos("");
        setCurso1("");
        setCurso2("");
        setCurso3("");
        setCurso4("");
      }
    } catch(err){
      setOpenModalError(true)
      setModalMessageError("Ocorreu um erro, tente novamente");
      console.error("Erro:", err);
    }
  }


  return (
    <div className={stylesModule.container_register}>
      <div className={stylesModule.nav_register}>
        <div className={stylesModule.navigation_bar}>
          <h1 className={stylesModule.link_register}>Registrar Funcionário</h1>
          <Link to={"/historico"} className={stylesModule.link_history}>Histórico de Funcionários</Link>
        </div>
      </div>

      <div className="container_record">
        <div className="record">
          {/***TODO: INPUT IMAGEM***/}
          <form className="foto" method='post' encType='multipart/form-data'>
            <input
              name='imagem'
              ref={inputRef} 
              className="img"
              multiple
              type='file' 
              accept='image/*' 
              onChange={handleImageChange}>
            </input>
            <button type='button' onClick={() => inputRef.current?.click()}><Paperclip size={25}/></button>
            {selectedImage && <img src={selectedImage} alt=""></img>}
          </form>

          <div className="inputs">
            {/***TODO: INPUT DADOS PESSOAIS***/}
            <form className="form_dados_pessoais" autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={stylesModule.form_group}>
                <div className={stylesModule.div_input} id={stylesModule.inptspan}>
                  <label for="nome">Nome Completo:</label>
                  <input 
                    type='text' 
                    id='nome' 
                    name='nome' 
                    autoFocus 
                    value={nome} 
                    maxLength={120}
                    onChange={(e) => {setNome(e.target.value)}}>
                  </input>
                </div>

                <div className={stylesModule.div_input}>
                  <label for="sexo">Sexo:</label>
                  <select id="sexo" name='sexo' value={sexo} onChange={e => setSexo(e.target.value)}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="M">M</option>
                    <option value="F">F</option>
                    <option value="Outros">Outros</option>
                    <option value="NI">NI</option>
                  </select>
                </div>
              </div>

              <div className={stylesModule.form_group}> 
                <div className={stylesModule.div_input}>
                  <label for="data_nasc">Data Nasc:</label>
                  <input 
                    type='date' 
                    id='data_nasc' 
                    name='data_nasc' 
                    value={data_nasc} 
                    onChange={(e) => {setDataNasc(e.target.value)}}>
                  </input>
                </div>

                <div className={stylesModule.div_input}>
                  <label for="estadoAtual">Estado:</label>
                  <select id='estadoAtual' name='estadoAtual' value={estadoAtual} onChange={(e) => {setEstadoAtual(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="AM">AM</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className={stylesModule.div_input} id={stylesModule.inptspan}>
                  <label for="nacionalidade">Nacionalidade:</label>
                  <input 
                    type='text' 
                    id='nacionalidade' 
                    name='nacionalidade' 
                    maxLength={100}                        
                    value={nacionalidade}
                    onChange={(e) => {setNacionalidade(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={stylesModule.form_group}>
                <div className={stylesModule.div_input} id={stylesModule.inptspan}>
                  <label for="Naturalidade">Naturalidade:</label>
                  <input
                    type='text' 
                    id='naturalidade' 
                    name='naturalidade'
                    maxLength={100}                         
                    value={naturalidade} 
                    onChange={(e) => {setNaturalidade(e.target.value)}}>
                  </input>
                </div>

                <div className={stylesModule.div_input}>
                  <label for="raca">Raça:</label>
                  <select id='raca' name='raca' value={raca} onChange={(e) => {setRaca(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Branco">Branco</option>
                    <option value="Pardo">Pardo</option>
                    <option value="Preto">Preto</option>
                    <option value="Amarelo">Amarelo</option>
                    <option value="Indígena">Indígena</option>
                    <option value="NI">NI</option>
                  </select>
                </div>

                <div className={stylesModule.div_input} id={stylesModule.inptspan}>
                  <label for="telefone">Telefone:</label>
                  <IMaskInput
                    mask="(00) 00000-0000"
                    id='telefone' 
                    name='telefone' 
                    value={telefone}
                    onAccept={(value) => setTelefone(value)}
                  />
                </div>
              </div>

              <div className={stylesModule.form_group}>
                <div className={stylesModule.div_input} id={stylesModule.inptspan}>
                  <label for="email">Email:</label>
                  <input 
                    type='email' 
                    id='email' 
                    name='email' 
                    value={email} 
                    maxLength={50}
                    onChange={(e) => {setEmail(e.target.value)}}>
                  </input>
                </div>
              </div>
            </form>


            {/***TODO: INPUT DADOS FAMILIARES***/}
            <form className="form_dados_familiares" autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={stylesModule.divisoria}>
                <hr></hr>
                <span className={stylesModule.title_divis}>Dados Familiares</span>
              </div>

              <span className="spandf">Pai</span>
              <div className={stylesModule.form_group}>
                <div className={stylesModule.div_input} id={stylesModule.inptspan}>
                  <label for="nome_pai">Nome Completo:</label>
                  <input 
                    type='text' 
                    id='nome_pai' 
                    name='nome_pai' 
                    value={nomePai} 
                    maxLength={100}
                    onChange={(e) => {setNomePai(e.target.value)}}>
                  </input>
                </div>
              </div>

              <span className="spandf">Mãe</span>
              <div className={stylesModule.form_group} id={stylesModule.form_group_mae}>
                <div className={stylesModule.div_input} id={stylesModule.inptspan}>
                  <label for="nome_mae">Nome Completo:</label>
                  <input 
                    type='text' 
                    id='nome_mae' 
                    name='nome_mae' 
                    value={nomeMae} 
                    maxLength={100}
                    onChange={(e) => {setNomeMae(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div id={stylesModule.dado_civil}>
                <div className={stylesModule.form_group}>
                  <div className={stylesModule.div_input}>
                    <label for="estado_civil">Estado Civil:</label>
                    <select id='estado_civil' name='estado_civil' value={estadoCivil} onChange={(e) => {setEstadoCivil(e.target.value)}}>
                      <option disabled={true} value="">Selecione</option>
                        <option value="Solteiro">Solteiro</option>
                        <option value="Casado">Casado</option>
                        <option value="União Estável">União Estável</option>
                        <option value="Separado">Separado</option>
                        <option value="Divorciado">Divorciado</option>
                        <option value="Viúvo">Viúvo</option>
                        <option value="NI">NI</option>
                    </select>
                  </div>

                  <div className={`${stylesModule.div_input} ${estadoCivil !== "Casado" &&  estadoCivil !== "União Estável" || estadoCivil === "" ? stylesModule.disabled : ""}`} id={stylesModule.inptspan}>
                    <label for="nome_esposoa">Nome Cônjuge:</label>
                    <input 
                      type='text' 
                      id='nome_esposoa' 
                      name='nome_esposoa' 
                      value={nomeEsposoa} 
                      maxLength={100}
                      disabled={estadoCivil !== "Casado" &&  estadoCivil !== "União Estável" || estadoCivil === ""} 
                      onChange={(e) => {setNomeEsposoa(e.target.value)}}>
                    </input>
                </div>
              </div>

              <div className={stylesModule.form_group}>
                <div className={stylesModule.div_input}>
                  <label for="filhos">Filhos:</label>
                  <select id='filhos' name='filhos' value={filhos} onChange={(e) => {setFilhos(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="Mais de 3">Mais de 3</option>
                  </select>
                </div>

                <div className={`${stylesModule.div_input} ${filhos === "0" || filhos === "" ? stylesModule.disabled : ""}`} id={stylesModule.inptspan}>
                  <label for="nome_filhos">Nome Filhos:</label>
                  <input 
                    type='text' 
                    id='nome_filhos' 
                    name='nome_filhos' 
                    value={nomeFilhos} 
                    maxLength={250}
                    disabled={filhos === "0" || filhos === ""} 
                    onChange={(e) => {setNomeFilhos(e.target.value)}}>
                  </input>
                </div>
              </div>
            </div>
          </form>

            {/***TODO: INPUT DADOS ENDEREÇO***/}
            <form className="form_dados_endereco" autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={stylesModule.divisoria} id={stylesModule.divis_docs}>
                <hr></hr>
                <span className={stylesModule.title_divis}>Endereço</span>
              </div>

              <div className={stylesModule.form_group}>
                <div className={stylesModule.div_input} id={stylesModule.inptspan}>
                  <label for="bairro">Bairro:</label>
                  <input
                    type='text' 
                    id='bairro' 
                    name='bairro' 
                    value={bairro} 
                    maxLength={50}
                    onChange={(e) => {setBairro(e.target.value)}}>
                  </input>
                </div>

                <div className={stylesModule.div_input}>
                  <label for="logadouro">Logadouro:</label>
                  <select id='logadouro' name='logadouro' value={logadouro} onChange={(e) => {setLogadouro(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Rua">Rua</option>
                    <option value="Avenida">Avenida</option>
                    <option value="Travessa">Travessa</option>
                    <option value="Estrada">Estrada</option>
                    <option value="Outros">Outros</option>
                    <option value="NI">NI</option>
                  </select>
                </div>
              </div>

              <div className={stylesModule.form_group}>
                <div className={stylesModule.div_input}>
                  <label for='estadoSelecionado'>Estado:</label>
                  <select id="estadoSelecionado" name='estadoSelecionado' value={estadoSelecionado} onChange={handleEstados}>
                    <option value="" disabled>Selecione</option>
                    {Object.keys(estadosCidades).map(estado =>(
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>

                <div className={stylesModule.div_input}>
                  <label for="cidadeSelecionada">Cidade</label>
                  <select id="cidadeSelecionada" name='cidadeSelecionada' value={cidadeSelecionada} onChange={handleCidade}>
                    <option value="" disabled>Selecione</option>
                    {cidades.map((cidade, index) =>(
                      <option key={index} value={cidade}>{cidade}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS ESCOLARES***/}
            <form className="form_dados_escolares" autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={stylesModule.divisoria} id={stylesModule.divis_docs}>
                <hr></hr>
                <span className={stylesModule.title_divis}>Formação Escolar</span>
              </div>

              <div className={stylesModule.form_group}>
                <div className={stylesModule.div_input}>
                  <label for="escolaridade">Escolaridade:</label>
                  <select id='escolaridade' name='escolaridade' value={escolaridade} onChange={(e) => {setEscolaridade(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Ensino Fundamental">Ensino Fundamental</option>
                    <option value="Ensino Médio">Ensino Médio</option>
                    <option value="Ensino Superior">Ensino Superior</option>
                    <option value="Pós Graduação">Pós Graduação</option>
                    <option value="Mestrado">Mestrado</option>
                    <option value="Doutorado">Doutorado</option>
                    <option value="Tecnólogo">Tecnólogo</option>
                    <option value="EJA">EJA</option>
                    <option value="Outros">Outros</option>
                    <option value="NI">NI</option>
                  </select>
                </div>

                <div className={stylesModule.div_input}>
                  <label for="cursos">Cursos:</label>
                  <select id='cursos' name='cursos' value={cursos} onChange={(e) => {setCursos(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="Mais de 4">Mais de 4</option>
                  </select>
                </div>

                <div className={`${stylesModule.div_input} ${cursos === "" || cursos === "0" ? stylesModule.disabled : ""}`} id={stylesModule.inptspan}>
                  <label for="curso1">Curso 1:</label>
                  <input 
                    type='text' 
                    id='curso1' 
                    name='curso1' 
                    value={curso1} 
                    maxLength={100}
                    disabled={cursos === "" || cursos === "0" ? stylesModule.disabled : ""}
                    onChange={(e) => {setCurso1(e.target.value)}}>
                  </input> 
                </div>
              </div>

              <div className={stylesModule.form_group}>
                <div className={`${stylesModule.div_input} ${cursos === "" || cursos === "0" || cursos === "1" ? stylesModule.disabled : ""}`} id={stylesModule.inptspan}>
                  <label for="curso2">Curso 2:</label>
                  <input 
                    type='text' 
                    id='curso2' 
                    name='curso2' 
                    value={curso2} 
                    maxLength={100}
                    disabled={cursos === "" || cursos === "0" || cursos === "1" ? stylesModule.disabled : ""}
                    onChange={(e) => {setCurso2(e.target.value)}}>
                  </input>
                </div>

                <div className={`${stylesModule.div_input} ${cursos === "" || cursos === "0" || cursos === "1" || cursos === "2" ? stylesModule.disabled : ""}`} id={stylesModule.inptspan}>
                  <label for="curso3">Curso 3:</label>
                  <input 
                    type='text' 
                    id='curso3' 
                    name='curso3' 
                    value={curso3} 
                    maxLength={100}
                    disabled={cursos === "" || cursos === "0" || cursos === "1" || cursos === "2" ? stylesModule.disabled : ""}
                    onChange={(e) => {setCurso3(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={`${stylesModule.div_input} ${cursos === "" || cursos === "0" || cursos === "1" || cursos === "2" || cursos === "3" ? stylesModule.disabled : ""}`}>
                <div className={stylesModule.div_input}>
                  <label for="curso4">Curso 4:</label>
                  <input 
                    type='text' 
                    id='curso4' 
                    name='curso4' 
                    value={curso4} 
                    maxLength={100}
                    disabled={cursos === "" || cursos === "0" || cursos === "1" || cursos === "2" || cursos === "3" ? stylesModule.disabled : ""}
                    onChange={(e) => {setCurso4(e.target.value)}}>
                  </input>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS VINCULO***/}
            <form className="form_dados_escolares" autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={stylesModule.divisoria} id={stylesModule.divis_docs}>
                <hr></hr>
                <span className={stylesModule.title_divis}>Dados Vínculo</span>
              </div>


              <div className={stylesModule.form_group}>
                <div className={stylesModule.div_input} id={stylesModule.inptspan}>
                  <label for="funcao">Função:</label>
                  <input 
                    type='text' 
                    id='funcao' 
                    name='funcao' 
                    value={funcao} 
                    maxLength={100}
                    onChange={(e) => {setFuncao(e.target.value)}}>
                  </input>
                </div>

                <div className={stylesModule.div_input} id={stylesModule.inptspan}>
                  <label for="contrato">Contrato:</label>
                  <select id='contrato' name='contrato' value={contrato} onChange={(e) => {setContrato(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Estagiário">Estagiário</option>
                    <option value="Contratado">Contratado</option>
                    <option value="Temporário">Temporário</option>
                  </select>
                </div>
              </div>

              <div className={stylesModule.form_group}>
                <div className={stylesModule.div_input} id={stylesModule.inptspan}>
                  <label for="setor">Setor:</label>
                  <input
                    type='text'
                    id='setor'
                    name='setor'
                    value={setor}
                    maxLength={100}
                    onChange={(e) => {setSetor(e.target.value)}}
                  />
                </div>
              </div>
            </form>

          </div>
        </div>
        <button onClick={submitForm} className="button_send">Salvar</button>
      </div>

      {/***TODO: MODALS***/}
      <Modal openModal={openModal} setOpenModal={setOpenModal} message={modalMessage} reload={reload} />
      <ModalError openModalError={openModalError} setOpenModalError={setOpenModalError} message={modalMessageError} reload={reload}/>
    </div>
  )
}

export default Registro