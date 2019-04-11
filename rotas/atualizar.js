const crypto = require('crypto')

const { query } = require('../lib/db')
const { required } = require('../lib/validate')

module.exports = (req, res) => {
  if (req.method !== 'PUT') require('../lib/405')(req, res)

  let json = {}

  const errors = required(['id'], req.query)

  if (Object.keys(errors).length !== 0) {
    json = JSON.stringify({
      status: 'notok',
      errors
    })
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(json)
  }

  let options = []
  let set = []

  if (req.body.name) {
    set.push(`name = ?`)
    options.push(req.body.name)
  }

  if (req.body.email) {
    set.push(`email = ?`)
    options.push(req.body.email)
  }

  if (req.body.password) {
    set.push(`password = ?`)
    options.push(crypto.createHmac('sha256', req.body.password).digest('hex'))
  }

  if (req.body.bio) {
    set.push(`bio = ?`)
    options.push(req.body.bio)
  }

  if (set.length === 0) {
    json = JSON.stringify({
      status: 'notok',
      errors: {
        body: 'Nenhum campo foi encontrado para atualização'
      }
    })
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(json)
  }

  let sql = `
    UPDATE users 
    SET ${set.join(', ')}
    WHERE id = ?;
  `

  options.push(req.query.id)

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

    if (data.affectedRows === 0) {
      json = JSON.stringify({
        status: 'notok',
        message: `Usuário com id '${req.query.id}' não encontrado.`,
        data
      })
      res.writeHead(404, { 'Content-Type': 'application/json' })
      return res.end(json)
    }

    json = JSON.stringify({
      status: 'ok',
      message: `Usuário com id '${req.query.id}' atualizado com sucesso.`
    })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(json)
  })
}
