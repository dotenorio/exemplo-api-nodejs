const { query } = require('../lib/db')

module.exports = (req, res) => {
  if (req.method !== 'GET') return require('../lib/405')(req, res)

  let json = {}
  let options = []
  let whereId = ''

  if (req.query.id) {
    whereId = 'WHERE id=?'
    options.push(req.query.id)
  }

  let sql = `
    SELECT id, name, email, bio
    FROM users
    ${whereId}
    LIMIT 1000
  `

  return query(sql, options, (err, data) => {
    if (err) {
      json = JSON.stringify({
        status: 'notok',
        errors: err
      })
      res.writeHead(400, { 'Content-Type': 'application/json' })
      return res.end(json)
    }

    if (data.length === 0) {
      json = JSON.stringify({
        status: 'notok',
        message: `Usuário com id '${req.query.id}' não encontrado.`
      })
      res.writeHead(404, { 'Content-Type': 'application/json' })
      return res.end(json)
    }

    json = JSON.stringify({
      status: 'ok',
      data
    })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(json)
  })
}
