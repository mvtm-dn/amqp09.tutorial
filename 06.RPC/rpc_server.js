#!/usr/bin/env node

const amqp = require('amqplib');
const q="rpc_requests";

let conn,channel;
    
var fib=function(n) {
        if (n<1) return 0;
        if (n<3) return 1;
        return fib(n-1)+fib(n-2);
    };


amqp.connect('amqp://localhost')
    .then(_conn=>{
        process.once("SIGING",()=>{conn.close();});
        conn=_conn;
        return conn.createChannel();
    })
    .then(ch=>{channel=ch;return channel.assertQueue(q,{durable: false});})
    .then(queue=>{
        console.log('[*] Waiting for RPC call ...');
        
        channel.consume(queue.queue,msg=>{
            let n=parseInt(msg.content.toString()),replyTo=msg.properties.replyTo,correlationId=msg.properties.correlationId;
            console.log('[*] fib(%d)',n);
            setTimeout(()=>{
                let res=fib(n);
                channel.sendToQueue(replyTo,Buffer.from(res.toString()),{correlationId:correlationId});
                channel.ack(msg);
            },30);
        },{noAck:false});
    })
    .catch(console.error);

