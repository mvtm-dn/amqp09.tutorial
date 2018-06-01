#!/usr/bin/env node

const amqp = require('amqplib');
const q="task_queue";

let conn,channel;

amqp.connect('amqp://localhost')
    .then(_conn=>{
        process.once("SIGINT",()=>{conn.close();console.log("Interrupted!");});
        conn=_conn;
        return conn.createChannel();
    })
    .then(ch=>{channel=ch;return ch.assertQueue(q,{durable:true});})
    .then(()=>{
        console.log('[*] Connected and waiting....');
        channel.prefetch(1);
        channel.consume(q,msg=>{
            let content=msg.content.toString(),secs=content.split(".").length;
            console.log('[*] Received msg "%s"',content);
            setTimeout(()=>{
                console.log('[*] Done message');
                channel.ack(msg);
            },secs*1000);
        },{noAck:false});
    })
    .catch(console.error);

