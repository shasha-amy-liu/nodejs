# Simple Stock App

## Gradle
### Build and run unit test
    ./gradlew :javascript-projects:hello-world-npm:npmTest

### Run app

    node server.js


## Docker
```
 docker build -t amy/simple-stock .
 docker images
 docker run -p 49160:8080 -d amy/simple-stock
 docker ps
```
![screen shot](./img/screenshot.jpg)

## Reference
[nodejs best practices](https://github.com/i0natan/nodebestpractices)
[nodejs package](http://nodesource.com/blog/your-first-nodejs-package/)
[nodejs unit test](https://buddy.works/guides/how-automate-nodejs-unit-tests-with-mocha-chai)
[dockerize nodejs app](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/)

## Todo