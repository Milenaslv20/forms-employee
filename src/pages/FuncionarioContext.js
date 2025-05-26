import React, { createContext, useState, useContext } from 'react'

const FuncionarioContext = createContext();

export const FuncionarioProvider = ({ children }) =>{
    const [funcionario, setFuncionario] = useState(null);
    const [usuario, setUsuario] = useState(null);

    return(
        <FuncionarioContext.Provider value={{ funcionario, setFuncionario, usuario, setUsuario }}>
            {children}    
        </FuncionarioContext.Provider>
    );
};

export const useFuncionario = () => useContext(FuncionarioContext);