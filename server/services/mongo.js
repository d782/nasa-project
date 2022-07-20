const mongoose=require('mongoose');
require('dotenv').config();
const MONGO_URL=`${process.env.MONGODB}`;

async function mongoConnect(){
    await mongoose.connect(MONGO_URL,{
    })
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}

mongoose.connection.once('open', ()=>{
    console.log('Mongodb ready!')
});
mongoose.connection.on('error',(err)=>{
    console.log(`${err}`)
})


module.exports={
    mongoConnect,
    mongoDisconnect
}