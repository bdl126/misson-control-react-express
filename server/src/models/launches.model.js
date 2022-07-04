const axios = require("axios")
const launchesDataBase = require('./launches.mongo')
const planets = require('./planets.mongo')

const  DEFAULT_FLIGH_NUMBER = 100

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"

async function populateLaunch() {
    console.log("getting space x data");
    const response = await axios.post(SPACEX_API_URL,
    {
        query : {},
        options: {
            pagination: false,
            populate:[
                {
                    path : 'rocket',
                    select : {
                        name : 1
                    }
                },
                {
                    path : "payloads",
                    select : {
                        customers : 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        throw new Error('launch data download failed')
    }

    const launchDocs = response.data.docs
    for( const launchDoc of launchDocs) {
        const payloads = launchDoc.payloads
        const customers = payloads.flatMap((payload)=>{
            return payload.customers
        })

        const launch = {
            flightNumber : launchDoc.flight_number,
            mission : launchDoc.name,
            rocket : launchDoc.rocket.name,
            launchDate : launchDoc.date_local,
            upcoming : launchDoc.upcoming,
            success : launchDoc.success,
            customers : customers
        }
        console.log(`${launch.flightNumber} ${launch.mission}`);
        saveLaunch(launch)
    }
}


async function loadLaunchData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })

    if(firstLaunch) {
        console.log("Launches already loaded!");
    } else {
        await populateLaunch()
    }

}

async function findLaunch(filter) {
    return await launchesDataBase.findOne(filter);
}

async function existLaunchWIthId(launchId) {
    return await findLaunch( {flightNumber: launchId} )
}

async function getLatestFlightNumber() {
    const lastestLaunch = await launchesDataBase
        .findOne()
        .sort('-flightNumber')

    if(!lastestLaunch) {
        return  DEFAULT_FLIGH_NUMBER
    }

    return lastestLaunch.flightNumber
}


async function getAllLaunches(skip, limit) {
    return await launchesDataBase.find({}, {
        '_id':0, '__v':0
    })
    .sort('flightNumber')
    .skip(skip)
    .limit(limit)
}

async function saveLaunch(launch) {

    await launchesDataBase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert : true
    })

}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1

    const planet = await planets.findOne({
        keplerName:launch.target,
    })

    if (!planet) {
        throw new Error('No matching planet found')
    }


    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customer:  ['NASA', "ZTM"],
        flightNumber : newFlightNumber,
        ...launch,
    })


    await saveLaunch(newLaunch);
    return launch

}

async function abortLaunchById(launchId) {

    const aborted =  await launchesDataBase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false,
    })

    return aborted.modifiedCount === 1
}

module.exports= {
    existLaunchWIthId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    loadLaunchData
}
