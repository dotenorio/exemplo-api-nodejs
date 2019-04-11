module.exports = (req, res) => {
  res.writeHead(405, { 'Content-Type': 'text/html; charset=UTF-8' })
  res.end(`Cannot ${req.method} ${req.url}`)
}
