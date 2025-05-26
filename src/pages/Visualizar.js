import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { jsPDF } from 'jspdf'
import { useFuncionario } from './FuncionarioContext'
import Axios from 'axios'

import { FolderDown } from 'lucide-react'
import defaultImage from '../svg/icon-person.jpg'

function Visualizar() {
  const endpoint = process.env.REACT_APP_API_BASE_URL;

  const { funcionario } = useFuncionario();
  const idFuncionario = funcionario.idFuncionario;

  const [files, setFiles] = useState([])
  
  const dataNasc = new Date(funcionario.dataNasc)
  const formatedDataNasc = dataNasc.toLocaleDateString('pt-BR')

  const dataNascPai = new Date(funcionario.dataNascPai)
  const formatedDataNascPai = dataNascPai.toLocaleDateString('pt-BR')

  const dataNascMae = new Date(funcionario.dataNascMae)
  const formatedDataNascMae = dataNascMae.toLocaleDateString('pt-BR')

  const dataDocs = new Date(funcionario.dataEntregaDocs)
  const formatedDataEntregaDocs = dataDocs.toLocaleDateString('pt-BR')

  const dataExped = new Date(funcionario.rgDataExped)
  const formatedDataExped = dataExped.toLocaleDateString('pt-BR')

  const [imageUrl, setImageUrl] = useState(`${endpoint}/uploads/${funcionario.nomeFuncionario}/foto_${funcionario.nomeFuncionario}.avif`);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (funcionario?.idFuncionario) {
      Axios.get(`${endpoint}/getFiles/${funcionario.idFuncionario}`)
        .then(response => {
          const data = response.data[0];
          const paths = data?.filePath ? JSON.parse(data.filePath) : [];
          const names = data?.originalFileNames ? JSON.parse(data.originalFileNames) : [];

          const filesData = paths.map((path, i) => ({
            name: names[i] || `Arquivo ${i + 1}`,
            path: path
          }));

          setFiles(filesData);
          })
        .catch(error => {
          console.error("Erro ao buscar arquivos:", error);
        });
    }
  }, [funcionario]);

  const convertBase64 = async (imageUrl) =>{
    try{
      const response = await fetch(imageUrl)
      const avifBlob = await response.blob()

      const image = new Image()
      const objetcURL = URL.createObjectURL(avifBlob)

      return new Promise((resolve, reject) =>{
        image.onload = () =>{
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          canvas.width = image.width
          canvas.height = image.height

          ctx.drawImage(image, 0, 0, image.width, image.height)

          const base64Image = canvas.toDataURL('image/png')

          resolve(base64Image)
        }

        image.onerror = (err) => reject(err)

        image.src = objetcURL
      })
    } catch (error){
      console.error(error)
      throw error
    }
  }

  const handleImageError = () =>{
    setImageUrl(defaultImage)
  }


  const getPdf = async() =>{
    try{
      const imageBase64 = await convertBase64(imageUrl);

      const doc = new jsPDF();

      const squareSize = 87; 
      const scaleFactor = 2; 
  
      const image = new Image();
      image.src = imageBase64;
  
      image.onload = () => {
        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d');
  
        cropCanvas.width = squareSize * scaleFactor;
        cropCanvas.height = squareSize * scaleFactor;
  
        cropCtx.imageSmoothingEnabled = true;
        cropCtx.imageSmoothingQuality = "high";
  
        const widthRatio = (squareSize * scaleFactor) / image.width;
        const heightRatio = (squareSize * scaleFactor) / image.height;
        const scaleRatio = Math.max(widthRatio, heightRatio);
  
        const cropWidth = (squareSize * scaleFactor) / scaleRatio;
        const cropHeight = (squareSize * scaleFactor) / scaleRatio;
  
        const cropX = (image.width - cropWidth) / 2;
        const cropY = (image.height - cropHeight) / 2;
  
        cropCtx.drawImage(
          image,
          cropX, cropY, cropWidth, cropHeight,
          0, 0, cropCanvas.width, cropCanvas.height 
        );
  
        const cropBase64 = cropCanvas.toDataURL('image/jpeg', 1.0);

        doc.setFont("helvetica");
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);

        doc.setFontSize(10)
        doc.setFont("helvetica", "bold");
        doc.text(`SECRETARIA DE ESTADO DE SEGURANÇA PÚBLICA \n SECRETARIA EXECUTIVA ADJUNTA DE INTELIGÊNCIA`, 105, 48, { align: "center" })
        doc.text(`FICHA CADASTRAL DE SERVIDORES`, 105, 59, { align: "center" })

      //  
        doc.addImage(cropBase64, 'JPEG', 12, 75, squareSize / scaleFactor, squareSize / scaleFactor);
        
        doc.text(`1 - DADOS PESSOAIS`, 30, 70, { align: "center" })
        doc.line(52, 68.5, 196, 68.5)

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11)
        doc.text(`NOME: ${funcionario.nomeFuncionario}`, 60, 77)
        doc.text(`DATA NASC.: ${formatedDataNasc}`, 60, 82.5)
        doc.text(`ESTADO: ${funcionario.estadoAtual}`, 60, 88.5)
        doc.text(`NACIONALIDADE: ${funcionario.nacionalidade}`, 60, 94.5)
        doc.text(`NATURALIDADE: ${funcionario.naturalidade}`, 60, 100.8)
        doc.text(`RAÇA: ${funcionario.raca}`, 60, 106.5)
        doc.text(`TELEFONE: ${funcionario.telefone}`, 60, 118.5)
        doc.text(`EMAIL: ${funcionario.email}`, 60, 112.5)

      //   

        doc.setFont("helvetica", "bold");
        doc.text(`2 - DADOS FAMILIARES`, 34, 128, { align: "center" })
        doc.line(60, 126.5, 195, 126.5)

        doc.text(`Pai`, 12, 136)
        doc.setFont("helvetica", "normal");
        doc.text(`NOME: ${funcionario.nomePai}`, 12, 141)
        doc.text(`DATA NASC.: ${formatedDataNascPai}`, 150, 141)
        doc.text(`CPF: ${funcionario.cpfPai}`, 12, 146)

        doc.setFont("helvetica", "bold");
        doc.text(`Mãe`, 12, 153)
        doc.setFont("helvetica", "normal");
        doc.text(`NOME: ${funcionario.nomeMae}`, 12, 158)
        doc.text(`DATA NASC.: ${formatedDataNascMae}`, 150, 158)
        doc.text(`CPF: ${funcionario.cpfMae}`, 12, 163)

        doc.text(`ESTADO CIVIL: ${funcionario.estadoCivil}`, 12, 172)
        doc.text(`NOME CÔNJUGE: ${funcionario.nomeEsposoA}`, 85, 172)
        doc.text(`FILHOS: ${funcionario.filhos}`, 12, 177.5)
        doc.text(`NOME FILHOS: ${funcionario.nomeFilhos}`, 12, 183)

      //

        doc.setFont("helvetica", "bold");
        doc.text(`3 - DOCUMENTOS`, 29, 192, { align: "center" })
        doc.line(49, 190.5, 195, 190.5)

        doc.setFont("helvetica", "normal");
        doc.text(`CPF: ${funcionario.cpf}`, 12, 199)
        doc.text(`PIS/PASEP: ${funcionario.pisPasep}`, 70, 199)
        doc.text(`CNH: ${funcionario.cnh}`, 140, 199)
        doc.text(`RG: ${funcionario.rg}`, 12, 204.5)
        doc.text(`DATA EXPED.: ${formatedDataExped}`, 60, 204.5)
        doc.text(`ORGÃO EXPED.: ${funcionario.rgOrgaoExped}`, 120, 204.5)
        doc.text(`UF: ${funcionario.rgUf}`, 180, 204.5)
        doc.text(`TÍTULO: ${funcionario.titulo}`, 12, 210.5)
        doc.text(`ZONA: ${funcionario.tituloZona}`, 75, 210.5)
        doc.text(`SEÇÃO: ${funcionario.tituloSecao}`, 120, 210.5)
        doc.text(`UF: ${funcionario.tituloUf}`, 180, 210.5)
        doc.text(`DOC. MILITAR: ${funcionario.docMilitar}`, 12, 216)
        doc.text(`SÉRIE: ${funcionario.docMilitarSerie}`, 120, 216)

      //

        doc.setFont("helvetica", "bold");
        doc.text(`4 - ENDEREÇO`, 25.5, 225, { align: "center" })
        doc.line(43, 224, 195, 224)

        doc.setFont("helvetica", "normal");
        doc.text(`BAIRRO: ${funcionario.bairro}`, 12, 232)
        doc.text(`LOGADOURO: ${funcionario.logadouro}`, 140, 232)
        doc.text(`RUA: ${funcionario.rua}`, 12, 237.5)
        doc.text(`NÚMERO: ${funcionario.numCasa}`, 150, 237.5)
        doc.text(`CEP: ${funcionario.cep}`, 12, 243.5)
        doc.text(`ESTADO: ${funcionario.estado}`, 140, 243.5)
        doc.text(`CIDADE: ${funcionario.cidade}`, 60, 243.5)

        const img1 = process.env.REACT_APP_API_IMG_1;
        doc.addImage(img1, "PNG", -1, 2, 213, 40) //-1 (x), 2(y), 213(width), 40(heigth) 

        const img2 = process.env.REACT_APP_API_IMG_2;
        doc.addImage(img2, "PNG", -1, 263, 213, 37)
      //
        doc.addPage()
      //
        doc.setFont("helvetica", "bold");
        doc.text(`5 - DADOS BANCÁRIOS`, 34, 48, { align: "center" })
        doc.line(60, 46.5, 194, 46.5)

        doc.setFont("helvetica", "normal");
        doc.text(`BANCO: ${funcionario.banco}`, 12, 55)
        doc.text(`AGÊNCIA: ${funcionario.bancoAgencia}`, 90, 55)
        doc.text(`CONTA: ${funcionario.bancoConta}`, 140, 55)

      //

        doc.setFont("helvetica", "bold");
        doc.text(`6 - FORMAÇÃO ESCOLAR`, 36, 65, { align: "center" })
        doc.line(64, 64, 194, 64)

        doc.setFont("helvetica", "normal");
        doc.text(`ESCOLARIDADE: ${funcionario.escolaridade}`, 12, 72)
        doc.text(`CURSOS: ${funcionario.cursos}`, 173.5, 72)
        doc.text(`CURSO 1: ${funcionario.curso1}`, 12, 77.5)
        doc.text(`CURSO 2: ${funcionario.curso2}`, 12, 83)
        doc.text(`CURSO 3: ${funcionario.curso3}`, 12, 89)
        doc.text(`CURSO 4: ${funcionario.curso4}`, 12, 94.5)

    //

        doc.setFont("helvetica", "bold");
        doc.text(`7 - VÍNCULO`, 23.5, 105, { align: "center" })
        doc.line(39, 103.5, 194, 103.5)

        doc.setFont("helvetica", "normal");
        doc.text(`VÍNCULO: ${funcionario.vinculo}`, 12, 112)
        doc.text(`SETOR/DEPARTAMENTO: ${funcionario.setorDepartamento}`, 80, 112)
        doc.text(`CARGO EFETIVO: ${funcionario.cargoEfetivo}`, 12, 117.5)
        doc.text(`CARGO/FUNÇÃO: ${funcionario.cargoFuncao}`, 130, 117.5)
        doc.text(`ORGÃO ORIGEM: ${funcionario.orgaoOrigem}`, 12, 123.5)
        doc.text(`MATRÍCULA ORIGEM: ${funcionario.matriculaOrigem}`, 130, 123)
        doc.text(`MATRÍCULA SEAI: ${funcionario.matriculaSeai}`, 12, 129.5)
        doc.text(`STATUS: ${funcionario.statusServidor}`, 130, 129)
        doc.text(`DATA DE ENTREGA DOS DOCUMENTOS: ${formatedDataEntregaDocs}`, 12, 135)
        doc.text(`ANOTAÇÕES: ${funcionario.anotacoes}`, 12, 140.5)


        doc.addImage(img1, "PNG", -1, 2, 213, 40) //-1 (x), 2(y), 213(width), 40(heigth) 

        doc.addImage(img2, "PNG", -1, 263, 213, 37)
      //
        doc.save(`FICHA ${funcionario.nomeFuncionario}.pdf`);
        //doc.output('dataurlnewwindow') 
      }
    } catch (error){
      console.error("Erro ao gerar a imagem: ", error)
    }
  } 

  return (
    <div className={styles.container_register}>
      <div className={styles.container_record}>
        <div className={styles.record}>
        <FolderDown onClick={getPdf} className={styles.button_download} size={55} strokeWidth={1.5}/>
          <img
              className={styles.img_vis}
              src={selectedImage || imageUrl} 
              alt='Imagem do Funcionário' 
              onError={handleImageError}
          />

          <div className={styles.inputs}>
            {/***TODO: INPUT DADOS PESSOAIS***/}
            <form className={styles.form_dados_pessoais}>
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="nome">Nome Completo:</label>
                  <span className={styles.span}>{funcionario.nomeFuncionario}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="sexo">Sexo:</label>
                  <span className={styles.span}>{funcionario.sexo}</span>
                </div>
              </div>

              <div className={styles.form_group}> 
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="dataNasc">Data Nasc:</label>
                  <span className={styles.span}>{formatedDataNasc}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="estado">Estado:</label>
                  <span className={styles.span}>{funcionario.estadoAtual}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="nacionalidade">Nacionalidade:</label>
                  <span className={styles.span}>{funcionario.nacionalidade}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="Naturalidade">Naturalidade:</label>
                  <span className={styles.span}>{funcionario.naturalidade}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="raca">Raça:</label>
                  <span className={styles.span}>{funcionario.raca}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="telefone">Telefone:</label>
                  <span className={styles.span}>{funcionario.telefone}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="email">Email:</label>
                  <span className={styles.span}>{funcionario.nacionalidade}</span>
                </div>
              </div>
            </form>


            {/***TODO: INPUT DADOS FAMILIARES***/}
            <form className={styles.form_dados_familiares}>
              <div className={styles.divisoria}>
                <hr></hr>
                <span className={styles.title_divis}>Dados Familiares</span>
              </div>

              <span className={styles.spandf}>Pai</span>
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="nome_pai">Nome Completo:</label>
                  <span className={styles.span}>{funcionario.nomePai}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cpf_pai">CPF:</label>
                  <span className={styles.span}>{funcionario.cpfPai}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="data_nasc">Data Nasc:</label>
                  <span className={styles.span}>{formatedDataNascPai}</span>
                </div>
              </div>

              <span className={styles.spandf}>Mãe</span>
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="nome_mae">Nome Completo:</label>
                  <span className={styles.span}>{funcionario.nomeMae}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cpf_mae">CPF:</label>
                  <span className={styles.span}>{funcionario.cpfMae}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="data_nasc_mae">Data Nasc:</label>
                  <span className={styles.span}>{formatedDataNascMae}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="estado_civil">Estado Civil:</label>
                  <span className={styles.span}>{funcionario.estadoCivil}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="nome_esposoa">Nome Cônjuge:</label>
                  <span className={styles.span}>{funcionario.nomeEsposoA}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="filhos">Filhos:</label>
                  <span className={styles.span}>{funcionario.filhos}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="nome_filhos">Nome Filhos:</label>
                  <span className={styles.span}>{funcionario.nomeFilhos}</span>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DOCUMENTOS***/}
            <form className={styles.form_dados_documentos}>
              <div className={styles.divisoria} id={styles.inptspan}>
                <hr></hr>
                <span className={styles.title_divis}>Documentos</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cpf">CPF:</label>
                  <span className={styles.span}>{funcionario.cpf}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="pis_pasep">PIS/PASEP:</label>
                  <span className={styles.span}>{funcionario.pisPasep}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cnh">CNH:</label>
                  <span className={styles.span}>{funcionario.cnh}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rg">RG:</label>
                  <span className={styles.span}>{funcionario.rg}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rg_data_exped">Data Exped:</label>
                  <span className={styles.span}>{formatedDataExped}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rg_orgao_exped">Orgão Exped:</label>
                  <span className={styles.span}>{funcionario.rgOrgaoExped}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rg_uf">UF:</label>
                  <span className={styles.span}>{funcionario.rgUf}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="titulo">Título:</label>
                  <span className={styles.span}>{funcionario.titulo}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="titulo_zona">Zona:</label>
                  <span className={styles.span}>{funcionario.tituloZona}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="titulo_secao">Seção:</label>
                  <span className={styles.span}>{funcionario.tituloSecao}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="titulo_uf">UF:</label>
                  <span className={styles.span}>{funcionario.tituloUf}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="doc_militar">Doc. Militar:</label>
                  <span className={styles.span}>{funcionario.docMilitar}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="doc_militar_serie">Série:</label>
                  <span className={styles.span}>{funcionario.docMilitarSerie}</span>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS ENDEREÇO***/}
            <form className={styles.form_dados_endereco}>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>Endereço</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="bairro">Bairro:</label>
                  <span className={styles.span}>{funcionario.bairro}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="num_casa">Número:</label>
                  <span className={styles.span}>{funcionario.numCasa}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cep">CEP:</label>
                  <span className={styles.span}>{funcionario.cep}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rua">Rua:</label>
                  <span className={styles.span}>{funcionario.rua}</span>
                </div>                

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="logadouro">Logadouro:</label>
                  <span className={styles.span}>{funcionario.logadouro}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for='estadoSelecionado'>Estado:</label>
                  <span className={styles.span}>{funcionario.estado}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cidadeSelecionada">Cidade:</label>
                  <span className={styles.span}>{funcionario.cidade}</span>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS BANCÁRIOS***/}
             <form className={styles.form_dados_bancarios}>
                <div className={styles.divisoria} id={styles.inptspan}>
                  <hr></hr>
                  <span className={styles.title_divis}>Dados Bancários</span>
                </div>

                <div className={styles.form_group}>
                  <div className={styles.div_input} id={styles.inptspan}>
                    <label for="banco">Banco:</label>
                    <span className={styles.span}>{funcionario.banco}</span>
                  </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="banco_agencia">Agência:</label>
                  <span className={styles.span}>{funcionario.bancoAgencia}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="banco_conta">Conta:</label>
                  <span className={styles.span}>{funcionario.bancoConta}</span>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS ESCOLARES***/}
            <form className={styles.form_dados_escolares}>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>Formação Escolar</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="escolaridade">Escolaridade:</label>
                  <span className={styles.span}>{funcionario.escolaridade}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cursos">Cursos:</label>
                  <span className={styles.span}>{funcionario.cursos}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="curso1">Curso 1:</label>
                  <span className={styles.span}>{funcionario.curso1}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="curso2">Curso 2:</label>
                  <span className={styles.span}>{funcionario.curso2}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="curso3">Curso 3:</label>
                  <span className={styles.span}>{funcionario.curso3}</span>
                </div>
              </div>

              <div className={styles.div_input}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="curso4">Curso 4:</label>
                  <span className={styles.span}>{funcionario.curso4}</span>
                </div>
              </div>
            </form>


            {/***TODO: INPUT DADOS VÍNCULO***/}
            <form className={styles.form_dados_vinculo}>
              <div className={styles.divisoria} id={styles.inptspan}>
                <hr></hr>
                <span className={styles.title_divis}>Vínculo</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="vinculo">Vínculo:</label>
                  <span className={styles.span}>{funcionario.vinculo}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="setorDepartamento">Setor/Departamento:</label>
                  <span className={styles.span}>{funcionario.setorDepartamento}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cargoFuncao">Cargo/Função:</label>
                  <span className={styles.span}>{funcionario.cargoFuncao}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cargoEfetivo">Cargo Efetivo:</label>
                  <span className={styles.span}>{funcionario.cargoEfetivo}</span>
                </div>
                  
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="status">Status:</label>
                  <span className={styles.span}>{funcionario.statusServidor}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="matriculaOrigem">Matricula Origem:</label>
                  <span className={styles.span}>{funcionario.matriculaOrigem}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="orgaoOrigem">Orgão Origem:</label>
                  <span className={styles.span}>{funcionario.orgaoOrigem}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="matriculaSeai">Matricula SEAI:</label>
                  <span className={styles.span}>{funcionario.matriculaSeai}</span>
                </div>
              </div>
                  
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="dataEntregaDocs">Data de entrega dos documentos:</label>
                  <span className={styles.span}>{formatedDataEntregaDocs}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                  <div className={styles.div_input} id={styles.anexoss}>
                    <label for="nome_anexos">Anexos:</label>

                    <div className={styles.name_file2_vis} id={styles.name_edit_vis}>
                      {files.length === 0 ? (
                        <p>Não Possui</p>
                      ) : (
                        files.map((file, index) => (
                          <div key={index} className={styles.name_edits_pdf}>
                            <a href={`${endpoint}/${file.path}`} target="_blank" rel="noopener noreferrer">
                              📄 {file.name} {index + 1}
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className={styles.div_input}>
                    <label for="anotacoes">Anotações:</label>
                    <p className={styles.span}>{funcionario.anotacoes}</p>
                  </div>
              </div>

              <div className={styles.form_group} id={styles.anotacoes}>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Visualizar