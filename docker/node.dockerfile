ARG VERSION=latest
FROM node:${VERSION}

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Install netcat so you can check if mongo is up
RUN apt-get update && apt-get install -y netcat

#set EST timezone
ENV TZ=EST5EDT
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install app dependencies
#COPY package.json /usr/src/app/
#COPY *.env* /usr/src/app/
#COPY wait-for.sh /usr/src/app/
COPY . /usr/src/app/
#RUN chown node /usr/src/app/wait-for.sh
RUN npm install --quiet
RUN npm install -g nodemon

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3000
CMD [ "./wait-for.sh", "mongo:27017", "-t", "30", "--", "node", "."]