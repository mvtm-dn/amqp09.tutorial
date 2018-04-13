#!/usr/bin/env node

const amqp = require('amqplib');
const q="rpc_requests";

let args=process.argv.slice(2),conn,channel;

if (!args.length) {
    console.warn("Call %s [n]",process.argv[1]);
    process.exit(1);
}

let n=parseInt(args[0])

var getUUID=function() {
    return Math.random().toString(16).substr(2)+
        '-'+Math.random().toString(16).substr(2)+
        '-'+Math.random().toString(16).substr(2)+
        '-'+Math.random().toString(16).substr(2);
};    

amqp.connect('amqp://localhost')
    .then(_conn=>{
        process.once("SIGING",()=>{conn.close();});
        conn=_conn;
        return conn.createChannel();
    })
    .then(ch=>{channel=ch;return ch.assertQueue('',{exclusive:true,durable:false});})
    .then((queue)=>{
        let corr=getUUID();
        
        console.log(" [*] Call RPC with n=%d",n);
        channel.sendToQueue(q,Buffer.from(n.toString()),{correlationId:corr,replyTo:queue.queue});
        
        return new Promise((res,rej)=>{
            channel.consume(queue.queue,msg=>{
                console.log(" [*] Got message from RPC %s",JSON.stringify(msg));
                if (msg.properties.correlationId===corr) {
                    channel.ack(msg);
                    res(msg.content.toString());
                }
            });
        });
    })
    .then((rez)=>console.log(' [x] fib(%d)=%d',n,rez))
    .then(()=>setTimeout(()=>{ conn.close(); process.exit(0) }, 500))
    .catch(console.error);

