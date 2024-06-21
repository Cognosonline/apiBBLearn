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

const verificateUser = async (req, res) => {

    try {
        const userName = req.body.user;
        const pass = req.body.pass

        console.log(req.body)

        console.log('nombre de usuario', userName)
        console.log('contraseña', pass)

        const userLog = await user.getOne(userName);
        console.log(userLog)
        const passEncrypt = await bcrypt.compare(pass, userLog.password);
      
        console.log('passEncrypt', passEncrypt)
        if (passEncrypt) {
            res.json({
                payload: true,
                message: 'usuario existe'
            })
        } else {
            res.json({
                payload: false,
                message: 'usuario no existe'
            })
        }
    } catch (error) {
        console.log('usuario no existente', error)
        res.json({
            payload: false,
            message: 'usuario no existente'
        })
    }


}

export { getUSer, verificateUser };