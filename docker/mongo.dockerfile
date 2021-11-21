ARG VERSION=latest
FROM mongo:${VERSION}

RUN apt-get update && \
    apt-get install -y \
    groff \
    less \
    curl \
    unzip \
    && apt-get clean

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install

RUN aws --version
#set EST timezone
ENV TZ=EST5EDT
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# backup/restore related tasks
WORKDIR /usr/src/backup
COPY ./backup.sh /usr/src/backup/backup.sh
COPY ./dump.zip /usr/src/backup/dump.zip
RUN unzip dump.zip