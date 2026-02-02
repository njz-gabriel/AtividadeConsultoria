const express = require('express')
const autenticar = (req,res,next)=>{
    const token = req.headers['authorization']
    if(token ==='newjeans'){
        next()
    } else{
        res.status(401).send('Não autorizado')
    }
}
module.exports = autenticar;