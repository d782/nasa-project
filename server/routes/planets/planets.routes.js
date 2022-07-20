const express=require('express');
const planetsRouter=express.Router();
const {getAllPlanets}=require('./planets.controllers');

planetsRouter.get('/',getAllPlanets);



module.exports=planetsRouter