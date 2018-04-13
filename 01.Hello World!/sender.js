#!/usr/bin/env node

const amqp = require('amqplib');

let q=process.argv.length>2?process.argv[2]:'hello',conn,channel;

amqp.connect('amqp://localhost')
    .then(_conn=>{conn=_conn;return conn.createChannel();})
    .then(ch=>{channel=ch;return ch.assertQueue(q,{durable:false});})
    .then(()=>channel.sendToQueue(q,Buffer.from(`Sending to queue ${q}`)))
    .then(()=>console.log('Sent message to %s',q))
    .then(()=>setTimeout(()=>{ conn.close(); process.exit(0) }, 500))
    .catch(console.error);

