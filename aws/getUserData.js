var AWS = require('aws-sdk');

exports.handler = function(event, context, callback) {
  AWS.config.update({region: 'eu-west-1'});
  ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

  var params = {
    TableName: 'Users',
    Key: { 'Name' : 'Raul' }
  };

  // Call DynamoDB to read the item from the table
  ddb.getItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.Item);
    }
  });

  callback(null, "message");
};
