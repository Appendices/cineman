FROM node
WORKDIR /node
COPY config ./config
RUN npm install ./config