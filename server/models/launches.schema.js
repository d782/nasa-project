const mongoose=require('mongoose');

const launchesSchema=new mongoose.Schema({
    flightNumber:{
        type:Number,
        required:true
    },
    mission:{
        type:String
    },
    rocket:{
        type:String,
        required:true
    },
    launchDate:{
        type:Date,
        required:true,
    },
    target:{
        type:String,
    },
    customers:[{
        type:String
    }],
    upcoming:{
        type:Boolean
    },
    success:{
        type:Boolean
    },
})

module.exports=mongoose.model('launches',launchesSchema);