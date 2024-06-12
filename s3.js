import {S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand} from'@aws-sdk/client-s3'
import {AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY} from './configs/configs3.js'
import fs from 'fs'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import { Sha256 } from "@aws-crypto/sha256-browser"; 


const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY

        
    }
})

export async function uploadFile(file){
    const stream = fs.createReadStream(file.tempFilePath);

    const uploadParams ={
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream
    }
     
    const command = new PutObjectCommand(uploadParams)
    const result = await client.send(command)
    
    return result

}


export async function getFiles(){

    const getFiles = {
        Bucket: AWS_BUCKET_NAME
    }

    const command = new ListObjectsCommand(getFiles)
    const result = await client.send(command)
    console.log(result)
}


export async function getFile(filename){

    const getFile = {
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    }

    const command = new GetObjectCommand(getFile)
    return await client.send(command)
}

export async function downloadFile(filename){

    const getFile = {
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    }

    const command = new GetObjectCommand(getFile)
    const result = await client.send(command)
    result.Body.pipe(fs.createWriteStream(`./images/${filename}`))
}

export async function getFileURL(filename) {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    });

    // Crea una instancia de Sha256
    const sha256 = new Sha256();

    // Obtiene la URL firmada
    const presignedUrl = await getSignedUrl(client, command, {
        expiresIn: 3600,
        sha256: sha256 // Usa Sha256 como el algoritmo de hash
    });

    
    return presignedUrl;
}