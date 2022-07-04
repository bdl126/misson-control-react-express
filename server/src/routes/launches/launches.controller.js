const {abortLaunchById, getAllLaunches, scheduleNewLaunch, existLaunchWIthId } = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
        error: "Missing required launch properity"
    })
  }

  launch.launchDate = new Date(launch.launchDate);

  if(isNaN(launch.launchDate)) {
    return res.status(400).json({
        error: "Invalid launch Date"
    })
  }

  const newlaunch = await scheduleNewLaunch(launch);
  return res.status(201).json(newlaunch);
}

async function httpAbortLaunch (req,res) {
  const launchId = Number(req.params.id)
  const existLaunch = await existLaunchWIthId(launchId)

  if(!existLaunch) {
    return res.status(404).json({
      error: "launch not found"
    })
  }

  const aborted = await abortLaunchById(launchId)
  if(!aborted) {
    return res.status(400).json({
      error: "Already aborted!"
    })
  }
  return res.status(200).json({
    ok: true
  })

}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
};
