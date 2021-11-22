#!/usr/bin/env node

const fs = require('fs')
const http = require('http')
const { join } = require('path')

const {
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
} = require('graphql')

function getServerSchema() {
  return new Promise((resolve, reject) => {
    const introspectionQuery = getIntrospectionQuery()

    function callback(response) {
      let data = ''

      response.on('data', (chunk) => {
        data += chunk
      })

      response.on('end', () => {
        resolve(data)
      })

      response.on('error', (err) => {
        reject(err)
      })
    }

    const req = http.request(
      'http://localhost:5000/_c/graphql',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
      },
      callback
    )

    req.write(JSON.stringify({ query: introspectionQuery }))

    req.end()
  })
}

getServerSchema()
  .then((schemaStr) => {
    const schemaJson = JSON.parse(schemaStr)

    const schema = buildClientSchema(schemaJson.data)

    fs.writeFileSync(
      join(__dirname, 'data', 'schema.graphql'),
      printSchema(schema)
    )

    console.log('OK')
  })
  .catch(() => {
    console.error("Something wen't wrong")
  })
