const request = require('supertest')
const app = require('../../app')

describe('TEST get /launches', () => {
    test("It should respond with 200 sucess", async () => {
            const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200)
    })
})

describe('TEST post /launches', () => {
    const completeLaunchData = {
        mission:"uss enterprise",
        rocket: "NCC",
        target: "kelper fuck",
        launchDate: 'January 4, 2052'
    }

    const launchDataWithoutDate = {
        mission:"uss enterprise",
        rocket: "NCC",
        target: "kelper fuck",
    }

    const completeLaunchDataWithInvalidDate = {
        mission:"uss enterprise",
        rocket: "NCC",
        target: "kelper fuck",
        launchDate: 'zoot'
    }

    test("It should respond with 201 sucess", async() => {
        const response = await request(app)
        .post("/launches")
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
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400)

        expect(response.body).toStrictEqual({
            error: "Missing required launch properity"
        })

     } )

    test("It should catch unvalid date", async() => {
        const response = await request(app)
        .post("/launches")
        .send(completeLaunchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400)

        expect(response.body).toStrictEqual({
            error: "Invalid launch Date"
        })
     } )
})