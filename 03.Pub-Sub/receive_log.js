#!/usr/bin/env node

const amqp = require('amqplib');
const ex="logs";

let conn,channel;

amqp.connect('amqp://localhost')
    .then(_conn=>{
        process.once("SIGINT",()=>{conn.close();});
        conn=_conn;
        return conn.createChannel();
    })
    .then(ch=>{channel=ch;return ch.assertExchange(ex,'fanout',{durable:false});})
    .then(()=>channel.assertQueue('',{exclusive:true,durable: false}))
    .then(queue=>{
        console.log('[*] Connected and waiting....');
        channel.bindQueue(queue.queue,ex,'');
        channel.consume(queue.queue,msg=>{
            let content=msg.content.toString();
            console.log('[*] Received msg "%s"',content);
            channel.ack(msg);
        },{noAck:false});
    })
    .catch(console.error);

