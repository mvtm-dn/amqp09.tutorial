# Work queues

Here we try to create work queue that will be used by time-consuming task. From (original tutorial description)[https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html]:

![P=>Q=>{C,C}](https://www.rabbitmq.com/img/tutorials/python-two.png)


>The main idea behind Work Queues is to avoid doing a resource-intensive task immediately and having to wait for it to complete. 
>Instead we schedule the task to be done later. We encapsulate a task as a message and send it to a queue. A worker process running in the background will pop the tasks and eventually execute the job.


 - producer [new_task.js](./new_task.js) 
 - consumer is [worker.js](./worker.js).
