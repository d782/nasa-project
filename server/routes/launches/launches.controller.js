const {getAllLaunches,scheduleNewLaunch,existsLaunchWithId,abortLauncById}=require('../../models/launches.model');
const {getPagination}=require('../../services/query');

async function httpGetAllLaunches(req,resp){

    const {skip,limit}=getPagination(req.query);
    return  resp.status(200).json(await getAllLaunches(skip,limit));
}
async function httpAddNewLaunch(req,resp){
    let {body}=req;

    if(!body.mission || !body.rocket || !body.launchDate || !body.target){
        return resp.status(400).send({error:'missing or wrong fields',success:false});
    }

    body.launchDate=new Date(body.launchDate);
    if(isNaN(body.launchDate)){
        return resp.status(400).send({error:'invalid Date',success:false});
    }
    await scheduleNewLaunch(body);
    return resp.status(201).json(body);
}

async function httpAbortLaunch(req,resp){
    const id=Number(req.params.id)
    const existsLaunch=await existsLaunchWithId(id)
    if(!existsLaunch){
        return resp.status(404).json({
            error:'Launch not found'
        })
    }
    const aborted=await abortLauncById(id);
    if(!aborted){
        return resp.status(400).json({error:'Launch not aborted'});
    }else{
        return resp.status(200).json({ok:aborted});
    }
    
}

module.exports={
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}