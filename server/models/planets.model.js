const fs=require('fs');
const path=require('path');
const {parse}=require('csv-parse');

const planets=require('./planets.schema');

function isHabitablePlanet(planet){
    return planet['koi_disposition']==='CONFIRMED'
    && planet['koi_insol']>0.36 && planet['koi_insol']<1.11 && planet['koi_prad']<1.6;
}

function loadPlanets(){
    return new Promise((resolve,reject)=>{
        fs.createReadStream(path.join(__dirname,'..','data','kepler_data.csv'))
        .pipe(parse({
            comment: "#",
            columns: true
        }))
        .on('data',async (data) => {
            if (isHabitablePlanet(data)) {
                await savePlanet(data);
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', () => {
            console.log('')
            resolve();
        });
    })
}

async function getPlanets(){
    return await planets.find({},{'__v':0,'_id':0});
}

async function savePlanet(planet){
    try {
        await planets.updateOne({
            keplerName:planet.kepler_name
        },{
            keplerName:planet.kepler_name
        },{
            upsert:true
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports={loadPlanets,getPlanets};