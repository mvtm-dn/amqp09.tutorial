#!/usr/bin/env node

const amqp = require('amqplib');
const ex="direct_logs";

let args=process.argv.slice(2),
    severinities=args.length?args:["info"],
    conn,channel;

amqp.connect('amqp://localhost')
    .then(_conn=>{
        process.once("SIGING",()=>{conn.close();});
        conn=_conn;
        return conn.createChannel();
    })
    .then(ch=>{channel=ch;return ch.assertExchange(ex,'direct',{durable:false});})
    .then(()=>channel.assertQueue('',{exclusive:true,durable: false}))
    .then(queue=>{
        console.log('[*] Connected and waiting severinities %s ....',severinities.join(","));
        severinities.forEach(severinity=>channel.bindQueue(queue.queue,ex,severinity));
        channel.consume(queue.queue,msg=>{
            let content=msg.content.toString(),severinity=msg.fields.routingKey;
            console.log('[*] %s : %s',severinity,content);
            channel.ack(msg);
        },{noAck:false});
    })
    .catch(console.error);

