var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'benchmark'
})

function query (sql, options = [], callback) {
  connection.query(sql, options, callback)
}

module.exports = {
  query
}
