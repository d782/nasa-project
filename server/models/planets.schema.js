const mongoose=require('mongoose');

const planetsSchema=new mongoose.Schema({
    keplerName:{
        type:String
    }
});

module.exports=mongoose.model('planets',planetsSchema);