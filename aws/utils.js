'use strict';
const AWS = require('aws-sdk');
const https = require('https');

module.exports = {
  sendEmail: (email, data) => {
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `${data.name} happened in ${data.location}, needs: ${data.needs}`
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: "There has been an accident in your area."
        }
      },
      Source: "raullm7@gmail.com"
    }

    const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
      .sendEmail(params)
      .promise();

    sendPromise
      .then(data => {
        console.log(data.MessageId);
      })
      .catch(err => {
        console.error(err, err.stack);
      });
  },
  getDistance: (loc1, loc2) => {
    https.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${loc1}&destinations=${loc2}&key=AIzaSyBL4DlcsRwF30d3zcLPC4lm61kOPisqWaY`, (resp) => {
      let data = '';
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        if (data.rows) {
          console.log(`DATA DISTANCE: ${JSON.stringify(data.rows.elements.distance)}`);
        }
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });

    return 100;
  }
};
