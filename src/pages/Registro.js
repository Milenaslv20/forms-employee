import React, { useState, useRef } from 'react'
import styles from './styles.module.css'
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
  const [cpfPai, setCpfPai] = useState('');
  const [dataNascPai , setDataNascPai] = useState(null);
  const [nomeMae, setNomeMae] = useState('');
  const [cpfMae, setCpfMae] = useState('');
  const [dataNascMae, setDataNascMae] = useState(null);

  const [estadoCivil, setEstadoCivil] = useState('');
  const [nomeEsposoa, setNomeEsposoa] = useState('');
  const [filhos, setFilhos] = useState('');
  const [nomeFilhos, setNomeFilhos] = useState('');

  const [cpf, setCpf] = useState('')
  const [pisPasep, setPisPasep] = useState('');
  const [selectCnh, setSelectCnh] = useState('')
  const [cnh, setCnh] = useState('')
  const [rg, setRg] = useState('')
  const [rgDataExped, setRgDataExped] = useState('')
  const [rgOrgaoExped, setRgOrgaoExped] = useState('')
  const [rgUf, setRgUf] = useState('')
  const [titulo, setTitulo] = useState('')
  const [tituloZona, setTituloZona] = useState('')
  const [tituloSecao, setTituloSecao] = useState('')
  const [tituloUf, setTituloUf] = useState('')
  const [selectDocMilitar, setSelectDocMilitar] = useState('')
  const [docMilitar, setDocMilitar] = useState('')
  const [docMilitarSerie, setDocMilitarSerie] = useState('')

  const [logadouro, setLogadouro] = useState('')
  const [numCasa, setNumCasa] = useState('')
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
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

  const [banco, setBanco] = useState('')
  const [bancoAgencia, setBancoAgencia] = useState('')
  const [bancoConta, setBancoConta] = useState('')

  const [escolaridade, setEscolaridade] = useState('')
  const [cursos, setCursos] = useState('')
  const [curso1, setCurso1] = useState('')
  const [curso2, setCurso2] = useState('')
  const [curso3, setCurso3] = useState('')
  const [curso4, setCurso4] = useState('')

  const [vinculo, setVinculo] = useState('')
  const [setorDepartamento, setSetorDepartamento] = useState('')
  const [cargoFuncao, setCargoFuncao] = useState('')
  const [cargoEfetivo, setCargoEfetivo] = useState('')
  const [statusServidor, setStatusServidor] = useState('')
  const [matriculaOrigem, setMatriculaOrigem] = useState('')
  const [orgaoOrigem, setOrgaoOrigem] = useState('')
  const [matriculaSeai, setMatriculaSeai] = useState('')
  const [files, setFiles] = useState([])
  const fileInputRhef = useRef(null)
  const [dataEntregaDocs, setDataEntregaDocs] = useState('')
  const [anotacoes, setAnotacoes] = useState('')

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

  //TODO: INPUT FILES
  const handleFileChange = (e) =>{
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  function clearFiles(){
    setFiles([])
    fileInputRhef.current.value = ""
  }

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

    if(cpf.trim() === ''){
      setModalMessageError("Preencha o CPF")
      setOpenModalError(true)
      return false;
    }

    if(rg.trim() === ''){
      setModalMessageError("Preencha o RG")
      setOpenModalError(true)
      return false;
    }

    if(rgDataExped.trim() === ''){
      setModalMessageError("Preencha a data de expedição do RG")
      setOpenModalError(true)
      return false;
    }

    if(rgOrgaoExped.trim() === ''){
      setModalMessageError("Preencha o orgão de expedição do RG")
      setOpenModalError(true)
      return false;
    }

    if(rgUf.trim() === ''){
      setModalMessageError("Preencha a UF do RG")
      setOpenModalError(true)
      return false;
    }

    if(titulo.trim() === ''){
      setModalMessageError("Preencha o Título")
      setOpenModalError(true)
      return false;
    }

    if(tituloZona.trim() === ''){
      setModalMessageError("Preencha a zona do título")
      setOpenModalError(true)
      return false;
    }

    if(tituloSecao.trim() === ''){
      setModalMessageError("Preencha a seção do título")
      setOpenModalError(true)
      return false;
    }

    if(tituloUf.trim() === ''){
      setModalMessageError("Preencha a UF do título")
      setOpenModalError(true)
      return false;
    }

    if(bairro.trim() === ''){
      setModalMessageError("Preencha o Bairro")
      setOpenModalError(true)
    }

    if(numCasa.trim() === ''){
      setModalMessageError("Preencha o número da casa")
      setOpenModalError(true)
      return false;
    }

    if(rua.trim() === ''){
      setModalMessageError("Preencha a Rua")
      setOpenModalError(true)
      return false;
    }

    if(logadouro.trim() === ''){
      setModalMessageError("Preencha o Logadouro")
      setOpenModalError(true)
      return false;
    }

    if(banco.trim() === ''){
      setModalMessageError("Preencha o nome do banco")
      setOpenModalError(true)
      return false;
    }
    if(regex.test(banco) === true){
      setModalMessageError("Preencha o nome do banco apenas com letras")
      setOpenModalError(true)
      return false;
    }

    if(bancoAgencia.trim() === ''){
      setModalMessageError("Preencha a agência do banco")
      setOpenModalError(true)
      return false;
    }

    if(bancoConta.trim() === ''){
      setModalMessageError("Preencha a conta do banco")
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

    if(vinculo.trim() === ''){
      setModalMessageError("Preencha o Vínculo")
      setOpenModalError(true)
      return false;
    }

    if(setorDepartamento.trim() === ''){
      setModalMessageError("Preencha o Setor/Departamento")
      setOpenModalError(true)
      return false;
    }

    if(cargoFuncao.trim() === ''){
      setModalMessageError("Preencha o Cargo/Função")
      setOpenModalError(true)
      return false;
    }

    if(statusServidor.trim() === ''){
      setModalMessageError("Preencha o Status do servidor")
      setOpenModalError(true)
      return false;
    }

    if(cursos.trim() === ''){
      setModalMessageError("Preencha a quantidade de cursos")
      setOpenModalError(true)
      return false;
    }

    if(dataEntregaDocs.trim() === ''){
      setModalMessageError("Preencha a Data de entrega dos documentos")
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
    formData.append("cpfPai", emptyInputsCpf(cpfPai));
    formData.append("dataNascPai", emptyInputsDate(dataNascPai));
    formData.append("nomeMae", nomeMae);
    formData.append("cpfMae", emptyInputsCpf(cpfMae));
    formData.append("dataNascMae", emptyInputsDate(dataNascMae));
    formData.append("estadoCivil", estadoCivil);
    formData.append("nomeEsposoa", emptyInputs(nomeEsposoa));
    formData.append("filhos", filhos);
    formData.append("nomeFilhos", emptyInputs(nomeFilhos));
      
    formData.append("cpf", cpf);
    formData.append("pisPasep", emptyInputs(pisPasep));
    formData.append("cnh", emptyInputs(cnh));
    formData.append("rg", rg);
    formData.append("rgDataExped", rgDataExped);
    formData.append("rgOrgaoExped", rgOrgaoExped);
    formData.append("rgUf", rgUf);
    formData.append("titulo", titulo);
    formData.append("tituloZona", tituloZona);
    formData.append("tituloSecao", tituloSecao);
    formData.append("tituloUf", tituloUf);
    formData.append("docMilitar", emptyInputs(docMilitar));
    formData.append("docMilitarSerie", emptyInputs(docMilitarSerie));
      
    formData.append("bairro", bairro);
    formData.append("numCasa", numCasa);
    formData.append("cep", cep);
    formData.append("rua", rua);
    formData.append("logadouro", logadouro);
    formData.append("cidadeSelecionada", cidadeSelecionada);
    formData.append("estadoSelecionado", estadoSelecionado)
      
    formData.append("banco", banco);
    formData.append("bancoAgencia", bancoAgencia);
    formData.append("bancoConta", bancoConta);
      
    formData.append("escolaridade", escolaridade);
    formData.append("cursos", cursos);
    formData.append("curso1", emptyInputs(curso1));
    formData.append("curso2", emptyInputs(curso2));
    formData.append("curso3", emptyInputs(curso3));
    formData.append("curso4", emptyInputs(curso4));
     
    formData.append("vinculo", vinculo);
    formData.append("setorDepartamento", setorDepartamento);
    formData.append("cargoFuncao", cargoFuncao);
    formData.append("cargoEfetivo", emptyInputs(cargoEfetivo));
    formData.append("statusServidor", statusServidor);
    formData.append("matriculaOrigem", emptyInputs(matriculaOrigem));
    formData.append("orgaoOrigem", emptyInputs(orgaoOrigem));
    formData.append("matriculaSeai", emptyInputs(matriculaSeai));
    formData.append("arquivosNome", files);
    formData.append("dataEntregaDocs", emptyInputsDate(dataEntregaDocs));
    formData.append("anotacoes", emptyInputs(anotacoes));

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

      if(files.length > 0){
        files.forEach(file =>{
          formDatas.append('pdfs', file)
        })
      } else{
        formDatas.append('pdfs', null)
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
        setCpfPai("");
        setDataNascPai("");
        setNomeMae("");
        setCpfMae("");
        setDataNascMae("");

        setEstadoCivil("");
        setNomeEsposoa("");
        setFilhos("");
        setNomeFilhos("");

        setCpf("");
        setPisPasep("");
        setSelectCnh("");
        setCnh("");
        setRg("");
        setRgDataExped("");
        setRgOrgaoExped("");
        setRgUf("");
        setTitulo("");
        setTituloZona("");
        setTituloSecao('');
        setTituloUf("");
        setSelectDocMilitar("");
        setDocMilitar("");
        setDocMilitarSerie("");

        setLogadouro("");
        setNumCasa("");
        setCep("");
        setRua("");
        setBairro("");
        setEstadoSelecionado("");
        setCidadeSelecionada("");

        setBanco("");
        setBancoAgencia("");
        setBancoConta("");

        setEscolaridade("");
        setCursos("");
        setCurso1("");
        setCurso2("");
        setCurso3("");
        setCurso4("");

        setVinculo("");
        setSetorDepartamento("");
        setCargoFuncao("");
        setCargoEfetivo("");
        setStatusServidor("");
        setMatriculaOrigem("");
        setOrgaoOrigem("");
        setMatriculaSeai("");
        setFiles([]);
        fileInputRhef.current.value = ""
        setDataEntregaDocs("");
        setAnotacoes("");
      }
    } catch(err){
      setOpenModalError(true)
      setModalMessageError("Ocorreu um erro, tente novamente");
      console.error("Erro:", err);
    }
  }


  return (
    <div className={styles.container_register}>
      <div className={styles.nav_register}>
        <div className={styles.navigation_bar}>
          <h1 className={styles.link_register}>Registrar Funcionário</h1>
          <Link to={"/historico"} className={styles.link_history}>Histórico de Funcionários</Link>
        </div>
      </div>

      <div className={styles.container_record}>
        <div className={styles.record}>
          {/***TODO: INPUT IMAGEM***/}
          <form className={styles.foto} method='post' encType='multipart/form-data'>
            <input
              name='imagem'
              ref={inputRef} 
              className={styles.img}
              multiple
              type='file' 
              accept='image/*' 
              onChange={handleImageChange}>
            </input>
            <button type='button' onClick={() => inputRef.current?.click()}><Paperclip size={25}/></button>
            {selectedImage && <img src={selectedImage} alt=""></img>}
          </form>

          <div className={styles.inputs}>
            {/***TODO: INPUT DADOS PESSOAIS***/}
            <form className={styles.form_dados_pessoais} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
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

                <div className={styles.div_input}>
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

              <div className={styles.form_group}> 
                <div className={styles.div_input}>
                  <label for="data_nasc">Data Nasc:</label>
                  <input 
                    type='date' 
                    id='data_nasc' 
                    name='data_nasc' 
                    value={data_nasc} 
                    onChange={(e) => {setDataNasc(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="estadoAtual">Estado:</label>
                  <select id='estadoAtual' name='estadoAtual' value={estadoAtual} onChange={(e) => {setEstadoAtual(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="AM">AM</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
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

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
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

                <div className={styles.div_input}>
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

                <div className={styles.div_input} id={styles.inptspan}>
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

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
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
            <form className={styles.form_dados_familiares} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.divisoria}>
                <hr></hr>
                <span className={styles.title_divis}>Dados Familiares</span>
              </div>

              <span className={styles.spandf}>Pai</span>
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
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

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cpf_pai">CPF:</label>
                  <IMaskInput
                    id='cpf_pai' 
                    name='cpf_pai' 
                    mask="000.000.000-00"
                    value={cpfPai}
                    onAccept={(value) => setCpfPai(value)}
                  />
                </div>

                <div className={styles.div_input}>
                  <label for="data_nasc">Data Nasc:</label>
                  <input 
                    type='date' 
                    id='data_nasc_pai' 
                    name='data_nasc_pai' 
                    value={dataNascPai}
                    onChange={(e) => {setDataNascPai(e.target.value)}}>
                  </input>
                </div>
              </div>

              <span className={styles.spandf}>Mãe</span>
              <div className={styles.form_group} id={styles.form_group_mae}>
                <div className={styles.div_input} id={styles.inptspan}>
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

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cpf_mae">CPF:</label>
                    <IMaskInput
                      id='cpf_mae' 
                      name='cpf_mae' 
                      mask="000.000.000-00"
                      value={cpfMae}
                      onAccept={(value) => setCpfMae(value)}
                  />
                </div>

                <div className={styles.div_input}>
                  <label for="data_nasc_mae">Data Nasc:</label>
                  <input 
                    type='date' 
                    id='data_nasc_mae' 
                    name='data_nasc_mae' 
                    value={dataNascMae} 
                    onChange={(e) => {setDataNascMae(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div id={styles.dado_civil}>
                <div className={styles.form_group}>
                  <div className={styles.div_input}>
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

                  <div className={`${styles.div_input} ${estadoCivil !== "Casado" &&  estadoCivil !== "União Estável" || estadoCivil === "" ? styles.disabled : ""}`} id={styles.inptspan}>
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

              <div className={styles.form_group}>
                <div className={styles.div_input}>
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

                <div className={`${styles.div_input} ${filhos === "0" || filhos === "" ? styles.disabled : ""}`} id={styles.inptspan}>
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

            {/***TODO: INPUT DOCUMENTOS***/}
            <form className={styles.form_dados_documentos} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.divisoria}>
                <hr></hr>
                <span className={styles.title_divis}>Documentos</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label>CPF:</label>
                  <IMaskInput
                    id='cpf' 
                    name='cpf' 
                    mask="000.000.000-00"
                    value={cpf}
                    onAccept={(value) => {
                      setCpf(value)
                      if (value.length === 14) {
                        verificarUsuario(value);
                      }
                    }}
                  />
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="pis_pasep">PIS/PASEP:</label>
                  <input 
                    type='text' 
                    id='pis_pasep' 
                    name='pis_pasep' 
                    value={pisPasep} 
                    maxLength={15}
                    onChange={(e) => {setPisPasep(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <select id='selectCnh' name='selectCnh' value={selectCnh} onChange={(e) => {setSelectCnh(e.target.value)}}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${selectCnh === "Não" || selectCnh === "" ? styles.disabled : ""}`} id={styles.inptspan}>
                  <label for="cnh">CNH:</label>
                  <input 
                    type='number' 
                    id='cnh' 
                    name='cnh' 
                    value={cnh} 
                    maxLength={13}
                    disabled={selectCnh === "Não" || selectCnh === "" ? styles.disabled : ""}
                    onChange={(e) => {setCnh(String(e.target.value))}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rg">RG:</label>
                  <input 
                    type='text' 
                    id='rg' 
                    name='rg' 
                    value={rg} 
                    maxLength={9}
                    onChange={(e) => {setRg(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="rg_data_exped">Data Exped:</label>
                  <input 
                    type='date' 
                    id='rg_data_exped' 
                    name='rg_data_exped' 
                    value={rgDataExped} 
                    onChange={(e) => {setRgDataExped(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="rg_orgao_exped">Orgão Exped:</label>
                  <select id='rg_orgao_exped' name='rg_orgao_exped' value={rgOrgaoExped} onChange={(e) => {setRgOrgaoExped(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="SSP/AM">SSP/AM</option>
                    <option value="PC/AM">PC/AM</option>
                    <option value="PM/AM">PM/AM</option>
                    <option value="Detran/AM">Detran/AM</option>
                    <option value="Outros">Outros</option>
                    <option value="NI">NI</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="rg_uf">UF:</label>
                  <select id="rg_uf" name="rg_uf" value={rgUf} onChange={(e) => {setRgUf(e.target.value)}}>
                    <option disabled={true} value="">Selecione:</option>
                    <option value="AM">AM</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                    <option value="NI">NI</option>
                  </select>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="titulo">Título:</label>
                  <input 
                    type='text' 
                    id='titulo' 
                    name='titulo' 
                    value={titulo} 
                    maxLength={15}
                    onChange={(e) => {setTitulo(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="titulo_zona">Zona:</label>
                  <input 
                    type='text' 
                    id='titulo_zona'
                    name='titulo_zona' 
                    value={tituloZona} 
                    maxLength={4}
                    onChange={(e) => {setTituloZona(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="titulo_secao">Seção:</label>
                  <input 
                    type='text' 
                    id='titulo_secao' 
                    name='titulo_secao' 
                    value={tituloSecao} 
                    maxLength={5}
                    onChange={(e) => {setTituloSecao(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="titulo_uf">UF:</label>
                  <select id="titulo_uf" name="titulo_uf" value={tituloUf} onChange={(e) => {setTituloUf(e.target.value)}}>
                    <option disabled={true} value="">Selecione:</option>
                    <option value="AM">AM</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                    <option value="NI">NI</option>
                  </select>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                    <select id='selectDocMilitar' name='selectDocMilitar' value={selectDocMilitar} onChange={(e) => {setSelectDocMilitar(e.target.value)}}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>

                  <div className={`${styles.div_input} ${selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""}`} id={styles.inptspan}>
                    <label for="doc_militar">Doc. Militar:</label>
                    <input
                      type='text' 
                      id='doc_militar' 
                      name='doc_militar' 
                      value={docMilitar} 
                      maxLength={15}
                      disabled={selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""} 
                      onChange={(e) => {setDocMilitar(e.target.value)}}>
                    </input>
                  </div>

                  <div className={`${styles.div_input} ${selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""}`} id={styles.inptspan}> 
                    <label for="doc_militar_serie">Série:</label>
                    <input 
                      type='text' 
                      id='doc_militar_serie' 
                      name='doc_militar_serie' 
                      value={docMilitarSerie} 
                      maxLength={12}
                      disabled={selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""} 
                      onChange={(e) => {setDocMilitarSerie(e.target.value)}}>
                    </input>
                  </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS ENDEREÇO***/}
            <form className={styles.form_dados_endereco} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>Endereço</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
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

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="num_casa">Número:</label>
                  <input 
                    type='text' 
                    id='num_casa' 
                    name='num_casa' 
                    value={numCasa} 
                    maxLength={5}
                    onChange={(e) => {setNumCasa(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cep">CEP:</label>
                  <IMaskInput
                    mask="00000-000"
                    id='cep' 
                    name='cep' 
                    value={cep}
                    onAccept={(value) => setCep(value)}
                  />
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rua">Rua:</label>
                  <input 
                    type='text' 
                    id='rua' 
                    name='rua' 
                    value={rua} 
                    maxLength={100}
                    onChange={(e) => {setRua(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
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

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for='estadoSelecionado'>Estado:</label>
                  <select id="estadoSelecionado" name='estadoSelecionado' value={estadoSelecionado} onChange={handleEstados}>
                    <option value="" disabled>Selecione</option>
                    {Object.keys(estadosCidades).map(estado =>(
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.div_input}>
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

            {/***TODO: INPUT DADOS BANCÁRIOS***/}
             <form className={styles.form_dados_bancarios} autoComplete='off' method='post' encType='multipart/form-data'>
                <div className={styles.divisoria} id={styles.divis_docs}>
                  <hr></hr>
                  <span className={styles.title_divis}>Dados Bancários</span>
                </div>

                <div className={styles.form_group}>
                  <div className={styles.div_input} id={styles.inptspan}>
                    <label for="banco">Banco:</label>
                    <input
                      type='text' 
                      id='banco' 
                      name='banco' 
                      value={banco} 
                      maxLength={80}
                      onChange={(e) => {setBanco(e.target.value)}}>
                    </input>
                  </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="banco_agencia">Agência:</label>
                  <input 
                    type='text' 
                    id='banco_agencia' 
                    name='banco_agencia' 
                    value={bancoAgencia} 
                    maxLength={9}
                    onChange={(e) => {setBancoAgencia(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="banco_conta">Conta:</label>
                  <input 
                    type='text' 
                    id='banco_conta' 
                    name='banco_conta' 
                    value={bancoConta} 
                    maxLength={20}
                    onChange={(e) => {setBancoConta(e.target.value)}}>
                  </input>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS ESCOLARES***/}
            <form className={styles.form_dados_escolares} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>Formação Escolar</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
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

                <div className={styles.div_input}>
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

                <div className={`${styles.div_input} ${cursos === "" || cursos === "0" ? styles.disabled : ""}`} id={styles.inptspan}>
                  <label for="curso1">Curso 1:</label>
                  <input 
                    type='text' 
                    id='curso1' 
                    name='curso1' 
                    value={curso1} 
                    maxLength={100}
                    disabled={cursos === "" || cursos === "0" ? styles.disabled : ""}
                    onChange={(e) => {setCurso1(e.target.value)}}>
                  </input> 
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={`${styles.div_input} ${cursos === "" || cursos === "0" || cursos === "1" ? styles.disabled : ""}`} id={styles.inptspan}>
                  <label for="curso2">Curso 2:</label>
                  <input 
                    type='text' 
                    id='curso2' 
                    name='curso2' 
                    value={curso2} 
                    maxLength={100}
                    disabled={cursos === "" || cursos === "0" || cursos === "1" ? styles.disabled : ""}
                    onChange={(e) => {setCurso2(e.target.value)}}>
                  </input>
                </div>

                <div className={`${styles.div_input} ${cursos === "" || cursos === "0" || cursos === "1" || cursos === "2" ? styles.disabled : ""}`} id={styles.inptspan}>
                  <label for="curso3">Curso 3:</label>
                  <input 
                    type='text' 
                    id='curso3' 
                    name='curso3' 
                    value={curso3} 
                    maxLength={100}
                    disabled={cursos === "" || cursos === "0" || cursos === "1" || cursos === "2" ? styles.disabled : ""}
                    onChange={(e) => {setCurso3(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={`${styles.div_input} ${cursos === "" || cursos === "0" || cursos === "1" || cursos === "2" || cursos === "3" ? styles.disabled : ""}`}>
                <div className={styles.div_input}>
                  <label for="curso4">Curso 4:</label>
                  <input 
                    type='text' 
                    id='curso4' 
                    name='curso4' 
                    value={curso4} 
                    maxLength={100}
                    disabled={cursos === "" || cursos === "0" || cursos === "1" || cursos === "2" || cursos === "3" ? styles.disabled : ""}
                    onChange={(e) => {setCurso4(e.target.value)}}>
                  </input>
                </div>
              </div>
            </form>


            {/***TODO: INPUT DADOS VÍNCULO***/}
            <form className={styles.form_dados_vinculo} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>Vínculo</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="vinculo">Vínculo:</label>
                  <select id='vinculo' name='vinculo' value={vinculo} onChange={(e) => {setVinculo(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Cargo Comissionado">Cargo Comissionado</option>
                    <option value="Estagiário(a)">Estagiário(a)</option>
                    <option value="Temporário">Temporário</option>
                    <option value="Efetivo">Efetivo</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="setorDepartamento">Setor/Departamento:</label>
                  <select id='setorDepartamento' name='setorDepartamento' value={setorDepartamento} onChange={(e) => {setSetorDepartamento(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Apoio Administrativo">Apoio Administrativo</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Gabinete">Gabinete</option>
                    <option value="Gerência de Análise">Gerência de Análise</option>
                    <option value="Gerência de Operações">Gerência de Operações</option>
                    <option value="Gerência de Contra Inteligência">Gerência de Contra Inteligência</option>
                    <option value="Laboratório">Laboratório</option>
                    <option value="Inteligência Cibernética">Inteligência Cibernética</option>
                    <option value="Outros">Outros</option>
                    <option value="NI">NI</option>
                  </select>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cargoFuncao">Cargo/Função:</label>
                  <input 
                    type='text' 
                    id='cargoFuncao' 
                    name='cargoFuncao' 
                    value={cargoFuncao} 
                    maxLength={30}
                    onChange={(e) => {setCargoFuncao(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cargoEfetivo">Cargo Efetivo:</label>
                  <input 
                    type='text' 
                    id='cargoEfetivo' 
                    name='cargoEfetivo' 
                    value={cargoEfetivo} 
                    maxLength={30}
                    onChange={(e) => {setCargoEfetivo(e.target.value)}}>
                  </input>
                </div>
                  
                <div className={styles.div_input}>
                  <label for="status">Status:</label>
                  <select id='status' name='status' value={statusServidor} onChange={(e) => {setStatusServidor(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Desligado">Desligado</option>
                  </select>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="matriculaOrigem">Matricula Origem:</label>
                  <input 
                    type='text' 
                    id='matriculaOrigem' 
                    name='matriculaOrigem' 
                    value={matriculaOrigem} 
                    maxLength={15}
                    onChange={(e) => {setMatriculaOrigem(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="orgaoOrigem">Orgão Origem:</label>
                  <input 
                    type='text' 
                    id='orgaoOrigem' 
                    name='orgaoOrigem' 
                    value={orgaoOrigem} 
                    maxLength={50}
                    onChange={(e) => {setOrgaoOrigem(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="matriculaSeai">Matricula SEAI:</label>
                  <input 
                    type='text' 
                    id='matriculaSeai' 
                    name='matriculaSeai' 
                    value={matriculaSeai} 
                    maxLength={15}
                    onChange={(e) => {setMatriculaSeai(e.target.value)}}>
                  </input>
                </div>
              </div>
                  
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.data_docs}>
                  <label for="dataEntregaDocs">Data de entrega dos documentos:</label>
                  <input 
                    type='date' 
                    id='dataEntregaDocs' 
                    name='dataEntregaDocs' 
                    value={dataEntregaDocs} 
                    onChange={(e) => {setDataEntregaDocs(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.anexoss}>
                  <label for="nome_anexos">Anexos:</label>
                  <input
                    name='pdfs'
                    id={styles.input_files}
                    type='file'
                    accept='application/pdf'
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRhef}
                    >
                  </input>

                  <div className={styles.name_file2}>
                    {files.length > 0 &&(
                      <ul>
                        {files.map((file, index) =>(
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                </div>

                <div className={styles.div_input} id={styles.anotacoes}>
                  <label for="anotacoes">Anotações:</label>
                  <textarea 
                    className={styles.input_anotacoes} 
                    type='text' 
                    id='anotacoes' 
                    name='anotacoes' 
                    value={anotacoes} 
                    onChange={(e) => {setAnotacoes(e.target.value)}}>
                  </textarea>
                </div>
              </div>

              <div className={styles.form_group} id={styles.anotacoes}>
              </div>
            </form>

            <button className={styles.clear_files} onClick={clearFiles}>Limpar</button>
          </div>
        </div>
        <button onClick={submitForm} className={styles.button_send}>Salvar</button>
      </div>

      {/***TODO: MODALS***/}
      <Modal openModal={openModal} setOpenModal={setOpenModal} message={modalMessage} reload={reload} />
      <ModalError openModalError={openModalError} setOpenModalError={setOpenModalError} message={modalMessageError} reload={reload}/>
    </div>
  )
}

export default Registro