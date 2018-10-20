'use strict';
var AWS = require("aws-sdk");
var sns = new AWS.SNS();

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));

        if (record.eventName == 'INSERT') {
            var disaster = JSON.stringify(record.dynamodb.NewImage.Name.S);
            var time = JSON.stringify(record.dynamodb.NewImage.Timestamp.S);
            var location = JSON.stringify(record.dynamodb.NewImage.Location.S)

            var params = {
                Subject: 'A new incident: ' + disaster,
                Message: time + ':\n\n ' + location,
                TopicArn: 'arn:aws:sns:eu-west-1:$ARN_ROLE:contactTopic'
            };
            sns.publish(params, function(err, data) {
                if (err) {
                    console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Results from sending message: ", JSON.stringify(data, null, 2));
                }
            });
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};
