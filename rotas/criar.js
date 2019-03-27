module.exports = (req, res) => {
  if (req.method === 'POST' && req.url === '/rotas/criar') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    var json = JSON.stringify({
      _timestamp: new Date().getTime()
    })
    res.end(json)
  }
}
