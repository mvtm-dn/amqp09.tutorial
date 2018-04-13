# amqp09.tutorial
Same examples from RabbitMQ, but tested with Apache qpid-j broker.

A set of little modified samples from RabbitMQ tutorial checked with Apache QPID-J broker. 

## Before you start


### Qpid-J
First you need to install and run [Apache Qpid-J broker](https://qpid.apache.org/components/broker-j/index.html) either from site or from [git repository](https://github.com/apache/qpid-broker-j).
Then you need do some configuration tasks. Unfortunately [amqp 0-9-1](https://raw.githubusercontent.com/squaremo/amqp.node/) does not support any 
of SASL auth mechainsms but PLAIN. By default PLAIN mechaism is not configured in Qpid-J. So you need to find "authenticationproviders" section
and add 
```
"secureOnlyMechanisms" : []
```
to all provider(s) you plan to use with AMQP protocol listener. 

In fact I think this code will work with any MQ broker that support AMQP-0.9 (e.g. RabbitMQ) too.

### Preparation
To run the tutorial code first you need to install all neccessary libraries. Just type 

```
npm install
```

and then you can run any scripts by typing (in bash) 
```
./send.js
```
or (both in bash and windows console)
```
node ./send.js
```

## Tutorials

### [Tutorial One. Hello World!][tt01]
A "Hello World" example, with one script sending a message to a queue,
and another receiving messages from the same queue.

### [Tutorial Two. Work queues][tt02]
More sophisticated example.  Multiple `worker` process will share the
tasks among them. Mocking the long-time tasks executions.

### [Tutorial Three. Publish/Subscribe][tt03]
Using MQ broker as a broadcast mechanism. 


### [Tutorial Four. Routing][tt04]
Using MQ broker as a router (somecast). 

### [Tutorial Five. Topics][tt05]
Extend previous tutorial to using wildcards. 

### [Tutoral Six. RPC][tt06]
Remote procedure call pattern with MQ broker


## Notes
I slightly modified original RabbitMQ tutorial code.

[tt01]:https://github.com/mvtm-dn/tree/master/01.Hello%20World%21
[tt02]:https://github.com/mvtm-dn/tree/master/02.Work%20queues
[tt03]:https://github.com/mvtm-dn/tree/master/03.Pub-Sub
[tt04]:https://github.com/mvtm-dn/tree/master/04.Routing
[tt05]:https://github.com/mvtm-dn/tree/master/05.Topics
[tt06]:https://github.com/mvtm-dn/tree/master/06.RPC

