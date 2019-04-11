const http = require('http')
const path = require('path')
const url = require('url')

const port = 8000
const host = 'localhost'

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true)
  req.pathname = pathname
  req.query = query

  if (req.pathname === '/') {
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

  req.on('error', (err) => {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' })
    res.end(err)
  })

  req.body = []

  req.on('data', (chunk) => {
    req.body.push(chunk)
  })

  req.on('end', () => {
    try {
      req.body = JSON.parse(Buffer.concat(req.body).toString())
    } catch (e) {}

    try {
      require(path.join(__dirname, req.pathname))(req, res)
    } catch (e) {
      console.log(e)
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' })
      res.end(`Cannot ${req.method} ${req.url}`)
    }
  })
})

server.listen(port, host, () => {
  console.info(`
    API disponível em http://${host}:${port}
  `)
})
