# REACT CALENDAR

## USAGE

### Quick create a component using grc.sh - usage is explained within the script comments

### Uses JSON-Server to serve Calendar Events from a fake-api - I think you can simply run it locally from the projects node_modules, if that doesnt work you will have to have to install it globally - https://www.npmjs.com/package/json-server

### JSON-Server has a small delay added in pkg.json to mimic back end loading time, to mimic an error thrown from the backend just run the FE without JSON-Server and try to hit / or /search

### run FE

```
yarn dev
```

### run JSON-Server

```
yarn fake-api
```

### run Storybook and Jest tests with these 2 commands

```
yarn storybook
```

```
yarn test
```
