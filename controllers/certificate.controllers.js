import { uploadFile, getFiles, getFile, downloadFile, getFileURL } from '../s3.js'
import certificate from '../repositories/certificate.repository.js'
import fs from 'fs'

const getCertificates = async (req, res) => {
    await getFiles()
    res.send('lista de objetos')
}

const getCertificate = async (req, res) => {

    const result = await getFileURL(req.params.filename)
    res.json({
        url: result
    })
}

const uploadCertificate = async (req, res) => {
    //console.log('cer:',req.files)
    await uploadFile(req.files.certificado);

    Object.values(req.files).forEach(file => {
        fs.unlinkSync(file.tempFilePath);
    });

    const fileCourse = await certificate.getOne(req.body.courseId)

    if (fileCourse) {     

        await certificate.update(fileCourse, req.files.certificado.name);
    } else {
        console.log('el curso no tiene certificado')
        const infoCertificate = await certificate.insert(req.files.certificado.name, req.body.courseId)
        res.json({
            message: 'archivo resivido',
            name: req.files.certificado,
            info: infoCertificate
        });
    }
}

const downloadCertificate = async (req, res) => {
    await downloadFile(req.params.filename)
    res.json({
        message: 'Archivo descargado'
    })
}

const getCertificateCourseId = async (req, res) => {
    
    const result = await certificate.getOne(req.params.courseId)
    //console.log(result)
    res.json({
        payload: result
    })

}

const deletedCertificate = async (req, res) => {
    try {
        const fileCourse = await certificate.getOne(req.body.courseId)
        
        await certificate.deleted(fileCourse)
       
    } catch (e) {
        console.log(e)
    }

}


const updateCoords = async (req, res) => {
    
    //console.log(req.body)
    const fileCourse = await certificate.getOne(req.body.courseId)

    let nameX = req.body.nameX
    let nameY = req.body.nameY
    let documentX = req.body.documentX
    let documentY = req.body.documentY
    let widthR = req.body.widthR
    let heightR = req.body.heightR

    const result = await certificate.updateCoords(fileCourse, nameX, nameY, documentX, documentY, widthR,heightR)
    res.json({
        payload: result
    })

}

const updateReqScore = async (req, res) => {

    const fileCourse = await certificate.getOne(req.body.courseId)
    console.log(fileCourse)
    const reqScore = req.body.reqScore
    const result = await certificate.updateScore(fileCourse,reqScore)
    res.json({
        payload: result
    })
}

const getReqScore = async (req, res) => {

    try {
        
         const fileCourse = await certificate.getOne(req.params.courseId)
         
         res.json({
            payload:fileCourse.reqScore
         })
    } catch (error) {
        console.log(error)
    }
}

export {
    getCertificates,
    uploadCertificate,
    getCertificate,
    downloadCertificate,
    getCertificateCourseId,
    deletedCertificate,
    updateCoords,
    updateReqScore,
    getReqScore
}