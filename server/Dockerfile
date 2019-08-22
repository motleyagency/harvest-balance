FROM node:latest

ENV WORKDIR=/home/node/harvest-balance-api

WORKDIR ${WORKDIR}

ADD . ${WORKDIR}

RUN chown -R node:node ${WORKDIR}

USER node

ENV NODE_ENV development

RUN npm install
# RUN CI=true yarn run test
RUN npm run build

RUN rm -fr src

ENV NODE_ENV production

EXPOSE 5000

CMD [ "npm", "run", "serve" ]
