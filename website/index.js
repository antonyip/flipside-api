const express = require('express')
const app = express()
const port = 3000
const { defaultEndpoint } = require('./defaultEndpoint')
const { getQueryWeb } = require('./getQuery')
const { storeQueryWeb } = require('./storeQuery')
const { getCachedQueryWeb } = require('./getCachedQuery')

const endpoints = [
  ['/', defaultEndpoint],
  ['/getQuery', getQueryWeb],
  ['/storeQuery', storeQueryWeb],
  ['/getCachedQuery', getCachedQueryWeb],
];

app.use(express.json())

endpoints.forEach(element => {
    app.post(element[0], (req, res) => {
        element[1](req, res);
      })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})