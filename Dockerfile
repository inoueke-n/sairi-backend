FROM node:16-alpine

WORKDIR /usr/src/app

RUN node --version

RUN mkdir dist

# Files in .dockerignore will be ignored
COPY dist dist

EXPOSE 80
CMD ["node", "dist/index.js"]

