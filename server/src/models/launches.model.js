const launchesDataBase = require('./launches.mongo')
const planets = require('./planets.mongo')

const  DEFAULT_FLIGH_NUMBER = 100

const launch = {
    flightNumber:100,
    mission: 'kepler exploratiomx ',
    rocket: "explorer IS1",
    launchDate: new Date(),
    target: "Kepler-442 b",
    customers: ['NASA', "ZTM"],
    upcoming: true,
    success: true
}

saveLaunch(launch)


async function existLaunchWIthId(launchId) {
    return await launchesDataBase.findOne({
        flightNumber: launchId
    })
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


async function getAllLaunches() {
    return await launchesDataBase.find({}, {
        '_id':0, '__v':0
    })
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName:launch.target,
    })

    if (!planet) {
        throw new Error('No matching planet found')
    }

    await launchesDataBase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert : true
    })
    const x = await launchesDataBase.find({}, {
        '_id':0, '__v':0
    })

}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1



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
    // const aborted = launches.get(launchId)
    // console.log(aborted);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted
}

module.exports= {
    existLaunchWIthId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
}
