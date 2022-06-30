const launches = new Map()

let latestFlightNumber = 100

const launch = {
    flightNumber:100,
    mission: 'kepler exploratiomx ',
    rocket: "explorer IS1",
    launchDate: new Date ('december 25, 2030'),
    target: "kepler-422 b",
    customer: ['NASA', "ZTM"],
    upcoming: true,
    success: true
}

launches.set(launch.flightNumber, launch)

function existLaunchWIthId(launchId) {
    return launches.has(+launchId)
}


function getAllLaunches() {
    return Array.from(launches.values())
}

function addNewLaunch(launch) {
    latestFlightNumber++

    launches.set(latestFlightNumber, Object.assign(launch, {
        success: true,
        flightNumber: latestFlightNumber,
        customer: ['NASA', "ZTM"],
        upcoming: true,
    }))
}

function abortLaunchById(launchId) {
    const aborted = launches.get(launchId)
    console.log(aborted);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted
}

module.exports= {
    existLaunchWIthId,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById
}
