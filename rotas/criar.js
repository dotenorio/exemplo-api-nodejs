const crypto = require('crypto')

const { query } = require('../lib/db')
const { required } = require('../lib/validate')

module.exports = (req, res) => {
  if (req.method !== 'POST') require('../lib/405')(req, res)

  let json = {}

  const errors = required(['name', 'email', 'password', 'bio'], req.body)

  if (Object.keys(errors).length !== 0) {
    json = JSON.stringify({
      status: 'notok',
      errors
    })
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(json)
  }

  let sql = `
    INSERT INTO users (name, email, password, bio)
    VALUES (?, ?, ?, ?);
  `
  let options = [
    req.body.name,
    req.body.email,
    crypto.createHmac('sha256', req.body.password).digest('hex'),
    req.body.bio
  ]

  delete req.body.password

  return query(sql, options, (err, data) => {
    if (err) {
      json = JSON.stringify({
        status: 'notok',
        errors: err
      })
      res.writeHead(400, { 'Content-Type': 'application/json' })
      return res.end(json)
    }

    json = JSON.stringify({
      status: 'ok',
      data: {
        id: data.insertId,
        ...req.body
      }
    })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(json)
  })
}
