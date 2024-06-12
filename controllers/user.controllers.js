import fetch from 'node-fetch';
import jsw from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import user from '../repositories/user.repository.js';

const getUSer = async (req, res) => {
    
    console.log('enviando data de user a blackboard')
   
    const userName = `uuid:${req.params.userId}`;
    console.log(req.headers.authorization)
    let authUser = req.headers.authorization;
    const userUrl = `${process.env.URL}/v1/users/${userName}`;
   
    const response = await fetch(userUrl, {
        method: 'GET',
        headers: {
            'Authorization': authUser
        }
    })

    const data = await response.json();
    console.log(data)
    if (data.status === 404) {
        res.json({
            payload:
            {
                message: 'no'
            }

        })
    } else {
        res.json({
            payload:
            {
                nombre: data.name,
                cedula: data.userName,
                rol: data.institutionRoleIds
            }

        })
    }

}

const verificateUser = async (req, res) =>{
    const userName = req.body.user;
    const pass = req.body.pass
    
    try {
        const userLog = await user.getOne(userName);    
        const passEncrypt = await bcrypt.compare(pass, userLog.password);
    
        if(passEncrypt){
            res.json({
                payload: true,
                message:'usuario existe'
            })
        }else{
            res.json({
                payload: false,
                message:'usuario existe'
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            payload:false,
            message:'usuario no existente'
        })
    }
   

}

export { getUSer, verificateUser };