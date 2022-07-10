const request = require('supertest')
const app = require('../../app')
const { loadPlanetData } = require('../../models/planets.model')
const {mongoConnect, mongoDisconnect} = require("./../../services/mongo")


describe('Launch API', () => {
    beforeAll( async ()=> {
        await mongoConnect();
        await loadPlanetData();
    })

    afterAll( async () => {
        await mongoDisconnect()
    })

    describe('TEST get /launches', () => {
        test("It should respond with 200 sucess", async () => {
                const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200)
        })
    })

    describe('TEST post /launches', () => {
        const completeLaunchData = {
            mission:"uss enterprise",
            rocket: "NCC",
            target: "Kepler-62 f",
            launchDate: 'January 4, 2052'
        }

        const launchDataWithoutDate = {
            mission:"uss enterprise",
            rocket: "NCC",
            target: "Kepler-62 f",
        }

        const completeLaunchDataWithInvalidDate = {
            mission:"uss enterprise",
            rocket: "NCC",
            target: "Kepler-62 f",
            launchDate: 'zoot'
        }

        test("It should respond with 201 sucess", async() => {
            const response = await request(app)
            .post("/v1/launches")
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201)

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const reponseDate = new Date(response.body.launchDate).valueOf()

            expect(requestDate).toBe(reponseDate)
            expect(response.body).toMatchObject(launchDataWithoutDate)
        } )

        test("It should catch missing properity", async () => {
            const response = await request(app)
            .post("/v1/launches")
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400)

            expect(response.body).toStrictEqual({
                error: "Missing required launch properity"
            })

        } )

        test("It should catch unvalid date", async() => {
            const response = await request(app)
            .post("/v1/launches")
            .send(completeLaunchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400)

            expect(response.body).toStrictEqual({
                error: "Invalid launch Date"
            })
        } )
    })
})