const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). 
 */

const fetchMyIP = function (callback) {
  const url = 'https://api.ipify.org/?format=json';
  request(`${url}`, (error, response, body) => {

    if (error) return callback(error, null);

    //if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ipAddress = JSON.parse(body);
    callback(null, ipAddress['ip']);

  });
}

/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */

const fetchCoordsByIP = (ip, callback) => {
  const longLatUrl = `https://freegeoip.app/json/${ip}`;
  request(`${longLatUrl}`, (error, response, body) => {

    if (error) return callback(error, null);

    //if non-200 status, assume server error (for invalid ip)
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const longLat = JSON.parse(body);
    //returns long and lat as an object
    callback(null, {
      latitude: longLat['latitude'],
      longitude: longLat['longitude'],
    });
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const flyOverUrl = `http://api.open-notify.org/iss-pass.json?lat=${coords['latitude']}&lon=${coords['longitude']}`;
  request(`${flyOverUrl}`, (error, response, body) => {
    if (error) return callback(error, null);

    //if non-200 status, assume server error 
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const flyOverTimes = JSON.parse(body).response;
    //returns fly over times for coords
    callback(null, flyOverTimes);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error)
 */
const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);

    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) return callback(error, null);

      fetchISSFlyOverTimes(coordinates, (error, passingTimes) => {
        if (error) return callback(error, null);

        callback(error, passingTimes)
      });
    });
  });
};


module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};