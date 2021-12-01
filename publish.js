const AWS=require('aws-sdk');

AWS.config.update({region:'ap-south-1'});

var params={
    Message:'test message',
    TopicArn:'arn:aws:sns:ap-south-1:326365652702:testTopic',
    MessageAttributes:{
        "MessageType": {
            DataType: "String",
            StringValue: "initial"
        }
    }
};

var publishTextPromise=new AWS.SNS({apiVersion:'2010-03-31'}).publish(params).promise();

publishTextPromise.then(
    data=>{
        console.log('success'+data.MessageId);
    }
).catch(
    err=>{
        console.log(err,err.stack);
    }
)