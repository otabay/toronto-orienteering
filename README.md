# Development Setup
## Install the development stack
- Install keystonejs (version 0.3.xx) dependencies:
    - Node.js 0.10+
    - MongoDB 3.2.x (not 3.4.x)
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
In the application directory create a file called .env and copy the content of [this file](https://docs.google.com/document/d/1ilKxrsREtoByE8tXPlfOMcXdd0ImPynTpDSz5txEuUw/edit) in it.
### Start and populate the database
- Start the mongo database by running the mongod command in a terminal
- In the application directory unzip the dump.zip file
- In the application directory import the data using the following command:
```
mongorestore --drop
```
### Run the application
- First time after you install the app download the project dependencies:
```
npm install
```
- Start the application
```
node keystone.js
```