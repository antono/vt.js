#
# Simple node app for debugging
# npm install express
#
# TODO: compile haml and sass on the fly
express = require('express')

app = express.createServer()
app.use express.logger({ format: ':method :url' })
app.use express.static(__dirname + '/')

app.get '/', (req, res) ->
  res.redirect('/html/player.html')

app.listen(3000)

console.log("Visit: http://localhost:3000/")
