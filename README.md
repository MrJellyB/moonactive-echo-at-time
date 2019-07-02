Original task:
===
Your task is to write a simple application server that prints a message at a given time in the future.
The server has only 1 API:
echoAtTime - which receives two parameters, time and message, and writes that message to the server console at the given time.
 
Since we want the server to be able to withstand restarts it will use redis to persist the messages and the time they should be sent at. You should also assume that there might be more than one server running behind a load balancer (load balancing implementation itself does not need to be provided as part of the answer)
In case the server was down when a message should have been printed, it should print it out when going back online.
The focus of the exercise is the efficient use of Redis and its data types as well as seeing your code in action. You can implement the exam in any language of your choice (preferably in NodeJS).

how to run
===
in the cli, run:
`
node server.js <PORT> 
`

then, to test an instance, run:
`
node test.js <numberOfRetries> <portOfServerInstance>
`
