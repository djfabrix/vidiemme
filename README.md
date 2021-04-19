## Simple Project Management Backend

> Simple project management backend built on Express and Typescript

### Docker compose
You can simple run project using Docker compose:
```sh
docker-compose up
```

### Local installation
You can also install and run locally the project.
##### Configuration
Rename file .env.template in .env

Edit .env file providing mysql database configuration and express server port number.

eg:

```ini
# express server port
PORT=3000
# mysql hostname
MYSQL_HOST=localhost
# mysql port
MYSQL_PORT=3306
#mysql username
MYSQL_USER=myuser
# mysql password
MYSQL_PASSWORD=mypassword
# mysql database name
MYSQL_DB=mydb
  
```

##### Install and run

```sh
npm install
npm run start
```

### Documentation 
> After running the node server, documentation is available at the following url:
>
[Project documentation](http://localhost:3000)

[OpenApi Swagger](http://localhost:3000/docs)



