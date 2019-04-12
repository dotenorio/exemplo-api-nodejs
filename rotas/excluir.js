const { query } = require('../lib/db')
const { required } = require('../lib/validate')

module.exports = (req, res) => {
  if (req.method !== 'DELETE') require('../lib/405')(req, res)

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

  let sql = `
    DELETE
    FROM users
    WHERE id = ?
    `
  let options = [req.query.id]

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
        message: `Usuário com id '${req.query.id}' não encontrado.`
      })
      res.writeHead(404, { 'Content-Type': 'application/json' })
      return res.end(json)
    }

    json = JSON.stringify({
      status: 'ok',
      message: `Usuário com id '${req.query.id}' excluido com sucesso.`
    })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(json)
  })
}
