const http = require('http')
const port = 8000
const host = 'localhost'

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(`
      <h1>Rotas:</h1>
      <ul>
        <li>rotas/excluir</li>
        <li>rotas/ler</li>
        <li>rotas/atualizar</li>
        <li>rotas/criar</li>
      </ul>
    `)
    res.end()
  }

  require('./rotas/excluir')(req, res)
  require('./rotas/ler')(req, res)
  require('./rotas/atualizar')(req, res)
  require('./rotas/criar')(req, res)

  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end(`Cannot ${req.method} ${req.url}`)
})

server.listen(port, host, () => {
  console.info(`
    API disponível em http://${host}:${port}
  `)
})
