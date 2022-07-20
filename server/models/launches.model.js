const launchesDB=require('./launches.schema');
const planets=require('./planets.schema');
const axios=require('axios').default;

const SPACEX_URL='https://api.spacexdata.com/v4/launches/query';

// flight_number,name,rocket.name, //date_local , //not applicable,//upcoming, //success
async function populateLaunches(){
    console.log('Downloading launch data...')
    const response = await axios.post(SPACEX_URL,{
        query:{},
        options:{
            pagination:false,
            populate:[
                {
                    path:"rocket",
                    select:{
                        name:1
                    }
                },{
                    path:"payloads",
                    select:{
                        customers:1
                    }
                }
            ]
        }
    });
    if(response.status !== 200){
        console.log('Problem downloading launches');
        throw new Error('Failed download');
    }

    const launchDocs=response.data.docs;

    for(const launchDoc of launchDocs){
            const payloads= launchDoc['payloads'];
            const customers=payloads.flatMap((payload)=>{
                return payload['customers'];
            })

            const launch={
                flightNumber:launchDoc['flight_number'],
                mission: launchDoc['name'],
                rocket: launchDoc['rocket'].name,
                launchDate:launchDoc['date_local'],
                upcoming:launchDoc['upcoming'],
                success:launchDoc['success'],
                customers,
            }

            await addNewLaunch(launch);
    }
}

async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        flightNumber:1,
        rocket:'Falcon 1',
        mission: 'FalconSat'
    });
    if(firstLaunch){
        
    }else{
        await populateLaunches();
    }
}

async function findLaunch(filter){
    return await launchesDB.findOne(filter);
}


async function getAllLaunches(skip,limit){
    return await launchesDB.
    find({},{'_id':0, '__v':0}).sort({flightNumber:-1}).skip(skip).limit(limit);
}

async function addNewLaunch(launch){
    try {
            await launchesDB.findOneAndUpdate({
                flightNumber: launch.flightNumber
            }, launch, {
                upsert: true
            })
    
    } catch (error) {
        console.log(error)
    }
}

async function existsLaunchWithId(launchId){
    return await findLaunch({flightNumber:launchId});
}

async function getLatestFlightNumber(){
    let valueDefault=100;
    let latestFlightNumber=await launchesDB.findOne({}).sort({flightNumber:-1}).limit(1);
    if(!latestFlightNumber || latestFlightNumber.length==0){
        return valueDefault;
    }
    
    return latestFlightNumber.flightNumber;
}

async function abortLauncById(launchId){
    let aborted=await launchesDB.updateOne({flightNumber:launchId},{
        upcoming:false,
        success:false
    })
    if(!aborted){
        return undefined
    }
    
    return aborted.acknowledged;
}

async function scheduleNewLaunch(launch){
    const planet=await planets.findOne({
        keplerName:launch.target
    })
    if(!planet){
        throw new Error('No matching planet found')
    }

    const  newFlightNumber=await getLatestFlightNumber()+1;
    const newLaunch = Object.assign(launch,{
        success:true,
        upcoming:true,
        customers:['Zero to mastery', 'NASA'],
        flightNumber: newFlightNumber,
    })

    await addNewLaunch(newLaunch)
}

module.exports={
    loadLaunchesData,
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLauncById
};