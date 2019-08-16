const button = document.getElementById('search-btn');
const title = ['Date', 'Open', 'Close', 'High', 'Low', 'SMA', 'RSI'];
button.addEventListener('click', function(e) {
    console.log('button was clicked');
  
    var symbol = document.getElementById('search-text').value;
    console.log("input symbol = " + symbol);
    fetch('/calculator/' + symbol, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => {
        console.log('response received successfully');
        // populate the chart
        var x_arr = [], close_arr = [], high_arr = [], low_arr = [], open_arr = [];
        var y_range = [0, 1000000000]
        var csvContent = title.join(',') + '\n';
        var rows = [];
        for (const d of data) {
          // prepare for plot
          x_arr.push(d.date);
          close_arr.push(d.close);
          high_arr.push(d.high);
          low_arr.push(d.low);
          open_arr.push(d.open);
          y_range[0] = Math.min(d.close, d.high, d.open, d.low);
          y_range[1] = Math.max(d.close, d.high, d.open, d.low);

          // prepare for csv generation
          row = []
          row.push(d.date); row.push(d.open); row.push(d.close);
          row.push(d.high); row.push(d.low); row.push(d.sma);
          row.push(d.rsi);

          rows.push(row);
          csvContent += row.join(',') + '\n'
        }
        plotCandleSticks(x_arr, close_arr, high_arr, low_arr, open_arr, y_range)

        // generate download button and csv file
        var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '-' + dd + '-' + yyyy;
        var fileName = `${symbol}-${today}.csv`;
        var btn = createDownloadBtn(csvContent, fileName);
        var table = createTable(rows, title);
        
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(btn);
        body.appendChild(table);
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  function plotCandleSticks(x_arr, close_arr, high_arr, low_arr, open_arr, y_range) {
    var x_arr_range = findMinMax(x_arr)
        var trace1 = {
          x: x_arr, 
          close: close_arr, 
          decreasing: {line: {color: '#7F7F7F'}}, 
          high: high_arr, 
          increasing: {line: {color: '#17BECF'}}, 
          line: {color: 'rgba(31,119,180,1)'}, 
          low: low_arr, 
          open: open_arr, 
          type: 'candlestick', 
          xaxis: 'x', 
          yaxis: 'y'
        };
        
        var array = [trace1];
        var layout = {
          dragmode: 'zoom', 
          margin: {
            r: 10, 
            t: 25, 
            b: 40, 
            l: 60
          }, 
          showlegend: false, 
          xaxis: {
            autorange: true, 
            domain: [0, 1], 
            range: x_arr_range, 
            rangeslider: {range: x_arr_range}, 
            title: 'Date', 
            type: 'date'
          }, 
          yaxis: {
            autorange: true, 
            domain: [0, 1], 
            range: y_range, 
            type: 'linear'
          }
        };
        
        Plotly.plot('plotly-div', array, layout, {showSendToCloud: true})
  }
  function findMinMax(x_arr) {
    let x_min = x_arr[0], x_max = x_arr[0];
  
    for (let i = 1, len=x_arr.length; i < len; i++) {
      let v = x_arr[i];
      x_min = (v < x_min) ? v : x_min;
      x_max = (v > x_max) ? v : x_max;
    }
  
    return [x_min, x_max];
  }

  function createDownloadBtn(content, fileName) {
    mimeType = 'text/csv;charset=utf-8;'
    var blob = new Blob([content], {type: mimeType})

    var btn = document.createElement('input')
    btn.type = 'button'
    btn.id = 'dwn-btn'
    btn.value = 'Download CSV'
    
    var link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.append(btn)
    return link
  }

  function createTable(rows, title) {
    var table = document.createElement('table');
    table.id = 'price-table';
    table.border = 1;

    var tblBody = document.createElement('tbody');
    var thRow = document.createElement('tr');
    for (const ttl of title) {
      var th = document.createElement('th');
      var txt = document.createTextNode(ttl);
      th.appendChild(txt);
      thRow.appendChild(th);
    }
    tblBody.appendChild(thRow);
    
    for (const row of rows) {
      var tr = document.createElement('tr');
      for (const price of row) {
        var td = document.createElement('td');
        var txt = document.createTextNode(price);
        td.appendChild(txt);
        tr.appendChild(td);
      }
      tblBody.appendChild(tr);
    }
    table.appendChild(tblBody);
    // table.border = 1;
    return table;
  }