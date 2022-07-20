
const http=require('http');
require('dotenv').config();
const {mongoConnect}=require('./services/mongo');
const https=require('https')

const app=require('./app');

const {loadPlanets}=require('./models/planets.model');
const {loadLaunchesData}=require('./models/launches.model')
const PORT=process.env.PORT||8000;


const server=http.createServer(app);


async function startServer(){
    await mongoConnect();
    
    await loadPlanets();
    await loadLaunchesData();
    server.listen(PORT,()=>{console.log(PORT)});
}

startServer();




