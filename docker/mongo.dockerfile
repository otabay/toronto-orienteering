ARG VERSION=latest
FROM mongo:${VERSION}

RUN apt-get update && \
    apt-get install -y \
        python3 \
        python3-pip \
        python3-setuptools \
        groff \
        less \
        unzip \
    && pip3 install --upgrade pip \
    && apt-get clean

RUN pip3 --no-cache-dir install --upgrade awscli
#set EST timezone
ENV TZ=EST5EDT
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# backup/restore related tasks
WORKDIR /usr/src/backup
COPY ./backup.sh /usr/src/backup/backup.sh
COPY ./dump.zip /usr/src/backup/dump.zip
RUN unzip dump.zip