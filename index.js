const AWS=require('aws-sdk');
const twilio=require('twilio')

AWS.config.update({region:'ap-south-1'});

exports.handler=async (event,context)=>{
    const reqRecord=event.Records[0];
    console.log(reqRecord.MessageAttributes);
    if(reqRecord.MessageAttributes.MessageType.StringValue=='initial'){
        const client=new twilio('AC2a75e14a168e47ffdc233351371179dd','1f6f65b6dbcaac6c128d879dcca3795a')
        await client.messages.create({
            to:'+919515172100',
            messagingServiceSid:'MG91e24ca8c5bcfe0a10b7876a817a464f',
            body:reqRecord.body
        }).then(message=>{
            console.log('[M] ',message.sid);
            sent=1;
        }).catch(err=>{
            console.log('[E] ',err);
        })
        console.log('message sent');
        var params={
            Message:'test message',
            TopicArn:'arn:aws:sns:ap-south-1:326365652702:testTopic',
            MessageAttributes:{
                "MessageType": {
                    DataType: "String",
                    StringValue: "review"
                }
            }
        };
        var publishTextPromise=new AWS.SNS({apiVersion:'2010-03-31'}).publish(params).promise();

        await publishTextPromise.then(
            data=>{
                console.log('success'+data.MessageId);
            }
        ).catch(
            err=>{
            console.log(err,err.stack);
            }
        )
        return 'sent';
    }
    return {}
}