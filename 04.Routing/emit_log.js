#!/usr/bin/env node

const amqp = require('amqplib');
const ex="direct_logs";

let args=process.argv.slice(2),
    severinity=args.length?args[0]:"info",
    msg=args.length>1?args.slice(1).join(" "):'Log record',conn,channel;

amqp.connect('amqp://localhost')
    .then(_conn=>{conn=_conn;return conn.createChannel();})
    .then(ch=>{channel=ch;return ch.assertExchange(ex,'direct',{durable:false});})
    .then(()=>channel.publish(ex,severinity,Buffer.from(msg)))
    .then(()=>console.log(' [x] Sent %s message "%s" to %s',severinity,msg,ex))
    .then(()=>setTimeout(()=>{ conn.close(); process.exit(0) }, 500))
    .catch(console.error);

