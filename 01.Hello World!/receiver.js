#!/usr/bin/env node

const amqp = require('amqplib');

let q=process.argv.length>2?process.argv[2]:'hello',conn,channel;

amqp.connect('amqp://localhost')
    .then(_conn=>{
        process.once("SIGINT",()=>{conn.close();});
        conn=_conn;return conn.createChannel();
    })
    .then(ch=>{channel=ch;return ch.assertQueue(q,{durable:false});})
    .then(()=>{
        console.log('[*] Waiting for msg');
        channel.consume(q,msg=>{
            console.log('[*] Received msg "%s"',msg.content.toString());
            channel.ack(msg);
        });
    })
    .catch(console.error);

