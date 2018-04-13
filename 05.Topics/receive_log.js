#!/usr/bin/env node

const amqp = require('amqplib');
const ex="topic_logs";

let args=process.argv.slice(2),
    topics=args.length?args:["anonymous.info"],
    conn,channel;

amqp.connect('amqp://localhost')
    .then(_conn=>{
        process.once("SIGING",()=>{conn.close();});
        conn=_conn;
        return conn.createChannel();
    })
    .then(ch=>{channel=ch;return ch.assertExchange(ex,'topic',{durable:false});})
    .then(()=>channel.assertQueue('',{exclusive:true,durable: false}))
    .then(queue=>{
        console.log('[*] Connected and waiting topics %s ....',topics.join(","));
        
        topics.forEach(topic=>channel.bindQueue(queue.queue,ex,topic));
        
        channel.consume(queue.queue,msg=>{
            let content=msg.content.toString(),topic=msg.fields.routingKey;
            console.log('[*] %s : %s',topic,content);
            channel.ack(msg);
        },{noAck:false});
    })
    .catch(console.error);

