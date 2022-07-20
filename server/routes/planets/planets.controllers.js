const {getPlanets}=require('../../models/planets.model');

const getAllPlanets=async (req,resp)=>{
    let planets=await getPlanets();
    return resp.status(200).json(planets);
}


module.exports={
    getAllPlanets,
}