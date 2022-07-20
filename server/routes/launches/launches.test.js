const request=require('supertest');
const app=require('../../app');
const  {mongoConnect,mongoDisconnect}=require('../../services/mongo')
require('jest');
const {loadPlanets}=require('../../models/planets.model')

const completeLaunch={
    "mission":"ZTM155",
    "rocket":"ZTM Experimental IS1",
    "target":"Kepler-62 f",
    "launchDate":"January 17, 2030"
}
const launchWithOutDate={
    "mission":"ZTM155",
    "rocket":"ZTM Experimental IS1",
    "target":"Kepler-62 f"
}


describe('launches API',()=>{
    //beforeAll -> 
    beforeAll(async ()=>{
        await mongoConnect();
        await loadPlanets();
    })
    afterAll(async ()=>{
        await mongoDisconnect();
    })

    describe('Test Get /launches',()=>{
        test('It should respond with 200 success',async ()=>{
            const response=await request(app).get('/v1/launches').expect('Content-Type',/json/).expect(200)
        })
    })
    
    describe('Test Post /launches',()=>{
        test('It should be respond 201 success',async()=>{
            const response=await request(app).post('/v1/launches').send(completeLaunch).expect(201);
        });
        test('Catch invalid properties',async ()=>{
            const response=await request(app).post('/v1/launches')
            .send(launchWithOutDate).expect('Content-Type',/json/)
            .expect(400);
    
           expect(response.body).toStrictEqual({error:'missing or wrong fields',success:false})
        })
        test('Should catch invalid dates',()=>{
    
        })
    })
})
