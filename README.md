# TodoWepapp

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn start
```

### Compiles and minifies for production

```
yarn build
```

Move build files in dist directory to your web server and you should be able to access the app

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## CI/CD

Within this repo is a **Jenkinsfile** with defines how this project should be built and deployed.
See a screenshot of a jenkins build job below. It logs the status of the build to a slack channel.

![Jenkins Slack](https://github.com/princeahugah/TodoWebApp/blob/master/jenkins-slack.png?raw=true)

You can access the [web app here](http://todo.princeahugah.com/)
