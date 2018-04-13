#!/usr/bin/env node

const amqp = require('amqplib');
const ex="topic_logs";

let args=process.argv.slice(2),
    topic=args.length?args[0]:"anonymous.info",
    msg=args.length>1?args.slice(1).join(" "):'Topic record',conn,channel;

amqp.connect('amqp://localhost')
    .then(_conn=>{conn=_conn;return conn.createChannel();})
    .then(ch=>{channel=ch;return ch.assertExchange(ex,'topic',{durable:false});})
    .then(()=>channel.publish(ex,topic,Buffer.from(msg)))
    .then(()=>console.log(' [x] Sent %s message "%s" to %s',topic,msg,ex))
    .then(()=>setTimeout(()=>{ conn.close(); process.exit(0) }, 500))
    .catch(console.error);

