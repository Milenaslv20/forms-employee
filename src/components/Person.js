import React, { useState, useEffect } from 'react'
import styles from '../pages/styles.module.css'
import { Link } from 'react-router-dom'
import { jsPDF } from 'jspdf'

import { FolderDown } from 'lucide-react'
import { ClipboardPen } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import clipBoardPen from '../svg/clipboard-pen.svg'
import defaultImage from '../svg/icon-person.jpg'

import { useFuncionario } from '../pages/FuncionarioContext'

const Person = ({ funcionario, handleOpenDeleteModal }) => {
  const endpoint = process.env.REACT_APP_API_BASE_URL;

  const { setFuncionario } = useFuncionario();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const url = `${endpoint}/uploads/${funcionario.nomeFuncionario}/foto_${funcionario.nomeFuncionario}.avif`;
    setImageUrl(url);
  }, [funcionario]);

  const handleVis = () =>{
    setFuncionario(funcionario)
  }

  const handleDelete = () =>{
    handleOpenDeleteModal(funcionario);
  }
 
  const handleImageError = () =>{
    setImageUrl(defaultImage)
  }

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


  const getPdf = async() =>{
    try{
      const imageBase64 = await convertBase64(imageUrl);

      const doc = new jsPDF();

      const squareWidth = 87; // Largura fixa da imagem
      const squareHeight = 95; // Aumentando a altura da imagem no PDF
      const scaleFactor = 2; // Fator de escala para aumentar a resolução do canvas
  
      const image = new Image();
      image.src = imageBase64;
  
      image.onload = () => {
        // Criar um canvas de recorte em alta resolução
        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d');
  
        cropCanvas.width = squareWidth * scaleFactor;
        cropCanvas.height = squareHeight * scaleFactor;
  
        cropCtx.imageSmoothingEnabled = true;
        cropCtx.imageSmoothingQuality = "high";
  
        // Calcular a proporção de escala para preencher o quadrado
        const widthRatio = (squareWidth * scaleFactor) / image.width;
        const heightRatio = (squareHeight * scaleFactor) / image.height;
        const scaleRatio = Math.max(widthRatio, heightRatio);
  
        // Calcular as dimensões da imagem recortada
        const cropWidth = (squareWidth * scaleFactor) / scaleRatio;
        const cropHeight = (squareHeight * scaleFactor) / scaleRatio;
  
        // Calcular o deslocamento para centralizar a imagem recortada
        const cropX = (image.width - cropWidth) / 2;
        const cropY = (image.height - cropHeight) / 2;
  
        // Desenhar a imagem no canvas de recorte
        cropCtx.drawImage(
          image,
          cropX, cropY, cropWidth, cropHeight, // Recorte da imagem original
          0, 0, cropCanvas.width, cropCanvas.height // Redimensionamento para o canvas
        );
  
        // Obter a string Base64 do canvas de recorte com qualidade melhorada
        const cropBase64 = cropCanvas.toDataURL('image/jpeg', 1.0);

        doc.setFont("helvetica");
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);

        doc.setFontSize(10)
        doc.setFont("helvetica", "bold");
        doc.text(`SECRETARIA DE ESTADO DE SEGURANÇA PÚBLICA \n SECRETARIA EXECUTIVA ADJUNTA DE INTELIGÊNCIA`, 105, 48, { align: "center" })
        doc.text(`FICHA CADASTRAL DE SERVIDORES`, 105, 59, { align: "center" })

      //  
        // Adicionar ao PDF no tamanho desejado (convertendo para uma escala normal
        doc.addImage(cropBase64, 'JPEG', 12, 73, squareWidth / scaleFactor, squareHeight / scaleFactor);
        
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
    <div className={styles.container_person}>

        <img
          className={styles.img_history}
          src={imageUrl}
          alt=''
          onError={handleImageError}
        />

        <div className={styles.texts}>
          <div key={funcionario.id} className={styles.textss}>
            <h1>{funcionario.nomeFuncionario}</h1>
            <span>{funcionario.vinculo}</span>
          </div>

          <div className={styles.buttons}>
            <div className={styles.button}>
              <FolderDown size={35} strokeWidth={1.5} onClick={getPdf}/>
            </div>
            <div className={styles.button}>
              <Link to='/visualizar' onClick={handleVis}><img src={clipBoardPen} alt='' className={styles.clipBoardPen}></img></Link>
            </div>
            <div className={styles.button}>
              <Link to='/editar' onClick={handleVis}><ClipboardPen size={35} strokeWidth={1.5}/></Link>
            </div>
            <div className={styles.button} onClick={handleDelete}>
              <Trash2 size={35} strokeWidth={1.5}/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Person