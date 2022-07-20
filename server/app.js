const path=require('path');
const fs=require('fs');
const morgan=require('morgan');
const express=require('express');
const cors=require('cors');
const api=require('./routes/api');

const app=express();

app.use(cors({origin:'http://localhost:3000'}));
app.use(morgan('common'));
app.use(express.json());
app.use('/v1',api);
app.use(express.static(path.join(__dirname,'build')));

app.use('/*',(req,resp)=>{
    resp.sendFile(path.join(__dirname,'build','index.html'))
})

module.exports=app