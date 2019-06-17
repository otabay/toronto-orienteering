# Development Setup

## Install docker

- https://docs.docker.com/install/

## Install the development tools

- [MS Visual Code](https://code.visualstudio.com/download) - for editing the code and debugging
- [Source Tree](https://www.sourcetreeapp.com/) - to manipulate the git repository
- [Robo mongo](https://robomongo.org/download) - to check the database

## Download, configure and run the app

### Download

Create a working directory and download the latest code. You can configure SourceTree to use the git repository or you can execute the following command:

```
git clone https://github.com/otabay/toronto-orienteering
```

### Configure

In the application directory create a file called .env and copy the content of [this file](https://drive.google.com/open?id=1mIlZdYcyEo1n2nizvuhM4s8Mc_EjUCSdkRlz6TPOfv0) in it.

### Start the server

- Execute docker-compose

```
docker-compose up --build -d
```

This will launch a mongo database and a nodejs server. It will take a bit of time first time you run it since it will download all required applications and dependencies

### Import data

- Unzip the mongo dump file

```
unzip dump.zip
```

- In the application directory import the data using the following command:

```
docker-compose run --rm mongo mongorestore --drop --noIndexRestore --host mongo:27017
```

### Run the application

- Open a browser and go to http://localhost:3000 to access the site
- Run the application in Visual Code
  - Open Visual Code
  - File -> Open -> Browse to the application directory
  - Go to the Debug menu
  - Add Configuration -> Docker: Attach to Node.js
  - If you want to debug the nodejs libraries that the app depend one, you will have to run npm install in your directory

# Production Setup

## Install && configure docker-machine

- https://docs.docker.com/machine/install-machine/
- https://docs.docker.com/machine/examples/aws/

## Launch an AWS EC2 instance

- This will create an EC2 instance with docker installed on it

```
docker-machine create --driver amazonec2 --amazonec2-open-port 3000 --amazonec2-region us-east-1 toc-prod
```

## Connect to the EC2 instance

- After this command all docker and docker-compose commands will be executed on the remote instance

```
eval $(docker-machine env toc-prod)
```

- To switch back to the local docker environment use

```
eval $(docker-machine env -u)
```

## Install the application on the server in production mode

- This will build and deploy the entire application (database, node.js, nginx)

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

## Deploy only the web application the server in production mode

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build --no-deps -d keystone
```

## Import data

- In the application directory import the data using the following command:

```
docker-compose run --rm mongo mongorestore --drop --noIndexRestore --host mongo:27017
```

## Backup data

- This will create backups of the data in Amazon S3 toc.app2.backup bucket
- Ideally we would create a crone job for this

```
docker-compose run --rm mongo ./backup.sh
```
