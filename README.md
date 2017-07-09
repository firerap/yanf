### YANF - simple webserver framework

##### Class *Server*

 - Server(autoload: boolean) - setup server with default configuration automatically.
 - setLogger - you can provide your own logger which should implement ILogger interface.
 - load - automatically load modules.


Default configuration:
 - winston as a logger
 - routes, dao, services load automatically.