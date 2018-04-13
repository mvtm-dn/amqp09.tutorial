#!/usr/bin/env node

const amqp = require('amqplib');
const ex="logs";

let msg=process.argv.length>2?process.argv.slice(2).join(" "):'Log record',conn,channel;

amqp.connect('amqp://localhost')
    .then(_conn=>{conn=_conn;return conn.createChannel();})
    .then(ch=>{channel=ch;return ch.assertExchange(ex,'fanout',{durable:false});})
    .then(()=>channel.publish(ex,'',Buffer.from(msg)))
    .then(()=>console.log(' [x] Sent message "%s" to %s',msg,ex))
    .then(()=>setTimeout(()=>{ conn.close(); process.exit(0) }, 500))
    .catch(console.error);

