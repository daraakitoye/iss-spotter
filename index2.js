const { nextISSTimesForMyLocation } = require('./iss_promised');


nextISSTimesForMyLocation()
  .then((passTimes) => {
    const dateAndTime = new Date().toString()
    for (const obj of passTimes) {
      console.log(`Next pass at ${dateAndTime} for ${obj['duration']} seconds.`)
    }
  })
  .catch((error) => {
    console.log("Error!", error.message);
  });