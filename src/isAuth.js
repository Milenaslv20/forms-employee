import Axios from 'axios';

export const isAuth = async (nomeUsuario, senhaUsuario) => {
    const endpoint = process.env.REACT_APP_API_BASE_URL;

    try{
        const res = await Axios.post(`${endpoint}/login`, { nomeUsuario, senhaUsuario })
        if(res.data.sucess){
            return { sucess:true }
        }
        else{
            return { sucess:false }
        }
    }catch (err){
        console.log("erro")
        return { sucess:false }
    }
};