'use strict';
const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const machinelearning = new AWS.MachineLearning();
const docClient = new AWS.DynamoDB.DocumentClient();
const arnRole = '602454197181';
const utils = require('./utils.js');

exports.handler = (event, context, callback) => {

  event.Records.forEach((record) => {
      console.log('Stream record: ', JSON.stringify(record, null, 2));

    if (record.eventName == 'INSERT') {
      const disaster = JSON.stringify(record.dynamodb.NewImage.Name.S);
      const time = JSON.stringify(record.dynamodb.NewImage.Timestamp.S);
      const location = JSON.stringify(record.dynamodb.NewImage.Location.S);
      const needs = JSON.stringify(record.dynamodb.NewImage.Needs.S);
      const disastertype = 'Hurricane';
      const city = 'San Francisco';
      const region = 'America';
      const currentmonth = 'Sep';
      const accidentduration = '3700';
      const accidentarea = '1.2';
      const deathcount = '2';
      const injurycount = '25';
      const homelesscount = '50';

      const mockData = {
        'region': region,
        'city_population': '700000',
        'density': '1600',
        'surface_area': JSON.stringify(accidentarea * 1000000), // km2 -> m2
        'disaster_type': disastertype,
        'local_GDP_pc': '39000',
        'death_count_parse': deathcount,
        'injury_count_parse': injurycount,
        'homeless_count_parse': homelesscount,
        'duration': accidentduration,
        'month': currentmonth,
        'physical damage': '2'
      };

      // Predict dimension of the damage
      const mlParams = {
        MLModelId: 'ml-qVUz1FHkEuV',
        PredictEndpoint: 'https://realtime.machinelearning.eu-west-1.amazonaws.com',
        Record: mockData
      };

      let peopleneeded;
      machinelearning.predict(mlParams, (err, data) => {
        if (err) console.log(err, err.stack);
        else {
          peopleneeded = Math.round(data.Prediction.predictedValue * 400);
          docClient.scan(usersParams, onScan);
        }
      });

      const usersParams = {
        TableName: 'Users',
        ProjectionExpression: '#location, #name, #email',
        ExpressionAttributeNames:{
          '#location': 'Location',
          '#name': 'Name',
          '#email': 'email'
        }
      };

      const onScan = (err, data) => {
        if (err) {
          console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
        } else {
          console.log('Query succeeded.');
          data.Items.forEach(user => {
            const distance = utils.getDistance(location, user.Location);
            console.log(`User: ${user.Name}`);

            if (distance < 500) {
              const disasterData = {
                disaster,
                location,
                needs,
                disastertype,
                city,
                region,
                currentmonth,
                accidentduration,
                accidentarea,
                deathcount,
                injurycount,
                homelesscount,
                peopleneeded
              };

              // Update user entry
              const updateParams = {
                TableName: 'Users',
                Key:{ 'Name': user.Name },
                UpdateExpression: 'set disasterData = :dd',
                ExpressionAttributeValues: {':dd': disasterData },
                ReturnValues:'UPDATED_NEW'
              };

              docClient.update(updateParams, (err, data) => {
                if (err) {
                  console.error('Unable to update item. Error JSON:', JSON.stringify(err, null, 2));
                } else {
                  console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
                }
              });

              console.log(`Email: ${user.email}`);

              utils.sendEmail(user.email, disasterData);
            }
          });
        }
      };




      // const params = {
      //   Subject: 'A new incident: ' + disaster,
      //   Message: time + ':\n\n ' + location,
      //   TopicArn: `arn:aws:sns:eu-west-1:${arnRole}:contactTopic`
      // };
      //
      // sns.publish(params, function(err, data) {
      //   if (err) {
      //     console.error('Unable to send message. Error JSON:', JSON.stringify(err, null, 2));
      //   } else {
      //     console.log('Results from sending message: ', JSON.stringify(data, null, 2));
      //   }
      // });
    }
  });
  callback(null, `Successfully processed ${event.Records.length} records.`);
};
