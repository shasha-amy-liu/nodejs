// refer to https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/
// for how to expose server and close it programmatically

const apikey = '5TL2U7K4MGT57N2P'
const default_interval = 5
function makeServer() {
  //Load express module with `require` directive
  var express = require('express')
  var url = require('url')
  var axios = require('axios')
  var calculator = require('./calculator.js')
  
  // start server
  var app = express()
  app.use(express.static('public'))

  var calculator_prefix = 'calculator'
  app.get('/' + calculator_prefix + '/:symbol' ,function(req, res) {
    var parsedUrl = url.parse(req.url)
    var symbol = url.parse(req.url).pathname.substring(calculator_prefix.length + 2)
    var alphavantage = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apikey}`
    console.log(`To send request to: ${alphavantage}`)
    
    axios.get(alphavantage)
      .then (function(response) {
        if (typeof(response.data['Time Series (Daily)']) == "undefined") {
          res.status(400).send()
        } else {
          var timeseries = response.data['Time Series (Daily)']
          var records = []
          Object.keys(timeseries).forEach(function(key) {
            var record = {}
            var prices = timeseries[key]
            record.date = key
            var i = 0
            var idx = Object.keys(prices)
            record.open = parseFloat(prices[idx[i]])
            record.high = parseFloat(prices[idx[++i]])
            record.low = parseFloat(prices[idx[++i]])
            record.close = parseFloat(prices[idx[++i]])
            records.push(record)
          })
        
          var buffer = []
          for (let i = 0; i < records.length; i++) {
            var record = records[i]
            buffer.push(record)
            if (buffer.length == default_interval) {
              var sma = calculator.calculateSMA(buffer)
              var rsi = calculator.calculateRSI(buffer)
              records[i-buffer.length+1].sma = sma
              records[i-buffer.length+1].rsi = rsi
              buffer.shift()
            }
          }

          // to take care the tail records
          while (buffer.length > 0) {
            var sma = calculator.calculateSMA(buffer)
            var rsi = calculator.calculateRSI(buffer)
            records[records.length-buffer.length].sma = sma
            records[records.length-buffer.length].rsi = rsi
            buffer.shift()
          }
          
          console.log(`number of records: ${records.length}`)
          res.status(200).send(records)
        }
      }).catch(function(err) {
        console.error(err)
      });
  })
  
  // Define request response in root URL (/) and serve index.html
  app.get('/', function (req, res) {
    res.status(200).sendFile(__dirname + '/index.html');
  })

  //Launch listening server on port 9999
  var server = app.listen(9999, function () {
    console.log('Listening on port 9999!')
  })
  
  return server;
}
module.exports = makeServer;