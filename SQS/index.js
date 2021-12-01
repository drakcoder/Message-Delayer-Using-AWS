
const AWS=require('aws-sdk');
const twilio=require('twilio');

exports.handler=async (event,context,callback)=>{
    AWS.config.update({region:'ap-south-1'})
    AWS.config.update({
        maxRetries:2,
        httpOptions:{
            timeout:30000,
            connectTimeout:5000
        }
    })

    var sqs= new AWS.SQS({apiVersion:'2017-11-05'})

    var qurl='https://sqs.ap-south-1.amazonaws.com/326365652702/testQueue'

    let ts=Date.now()

    ts=Math.floor(ts/1000)
    // console.log(sqs)
    console.log('entered')
    var params={
        AttributeNames:[
            'SentTimestamp'
        ],
        MaxNumberOfMessages:10,
        MessageAttributeNames:[
            'all'
        ],
        QueueUrl:qurl,
        VisibilityTimeout:1,
        WaitTimeSeconds:0
    };
    
    return sqs.receiveMessage(params, async (err,data)=>{
        console.log("[-] In sqs.receiveMessage")
        console.log('data',data)
        if(err){
            console.log("ERROR") 
            console.log(err);
        }
        else if (data.Messages){
            console.log('message is present');
            var deleteParams={
                QueueUrl:qurl,
                ReceiptHandle:data.Messages[0].ReceiptHandle,
            };
            let rts=Math.floor(parseInt(data.Messages[0].Attributes.SentTimestamp)/1000)
            console.log(ts,rts,ts-rts);
            if(ts-rts>0){
                console.log('entered ts-rts');
                var client=new twilio('AC2a75e14a168e47ffdc233351371179dd','1f6f65b6dbcaac6c128d879dcca3795a')
                client.messages.create({
                    to:'+919515172100',
                    messagingServiceSid:'MG91e24ca8c5bcfe0a10b7876a817a464f',
                    body:data.Messages[0].Body
                }).then(message => {
                    console.log('[M]',message);
                    // callback(null, message.sid)
                }).catch(e => {
                    console.log('[E]',e);
                    // callback(Error(e))
                })
                await sqs.deleteMessage(deleteParams,(err,data)=>{
                    if(err){
                        console.log('ERR',err);
                    }
                    else{
                        console.log('deleted',data);
                    }
                }).promise()
            }
            context.succeed("done");
        }
        return "Failed"
    }).promise()
}
