const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  //success, print details
  const dateAndTime = new Date().toString()
  for (const obj of passTimes) {
    console.log(`Next pass at ${dateAndTime} for ${obj['duration']} seconds.`)
  }
});

