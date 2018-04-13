#!/usr/bin/env node

const amqp = require('amqplib');
const q="task_queue";

let msg=process.argv.length>2?process.argv.slice(2).join(" "):'Do a task!',conn,channel;

amqp.connect('amqp://localhost')
    .then(_conn=>{conn=_conn;return conn.createChannel();})
    .then(ch=>{channel=ch;return ch.assertQueue(q,{durable:true});})
    .then(()=>channel.sendToQueue(q,Buffer.from(msg),{persistent:true}))
    .then(()=>console.log('Sent message "%s" to %s',msg,q))
    .then(()=>setTimeout(()=>{ conn.close(); process.exit(0) }, 500))
    .catch(console.error);

