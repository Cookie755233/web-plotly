class PlotHandler {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('updateChartBtn').addEventListener('click', () => {
      this.updatePlot();
    });

    // Color picker event listeners
    ['preColor', 'postColor', 'valueColor'].forEach(id => {
      document.getElementById(id).addEventListener('change', () => this.updatePlot());
    });

    // File input handling
    document.getElementById('fileInput').addEventListener('change', (e) => {
      this.handleFileUpload(e);
    });
  }

  handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      this.handleCSV(file);
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      this.handleExcel(file);
    }

    // Reset file input
    e.target.value = '';
  }

  handleCSV(file) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        this.processData(results.data);
      }
    });
  }

  handleExcel(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = e.target.result;
      const workbook = XLSX.read(fileData, { type: 'array', cellDates: true });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
        dateNF: 'yyyy-mm-dd'
      });

      // Remove header row and convert to object array
      const headers = jsonData.shift();
      const data = jsonData.map(row => {
        // Handle empty cells
        while (row.length < 6) {
          row.push(null);
        }
        return row.reduce((obj, cell, index) => {
          // Convert Excel date numbers to date strings if needed
          if (index === 0 && cell) {
            if (typeof cell === 'number') {
              // If it's a simple month number
              if (cell >= 1 && cell <= 12) {
                obj[index] = cell;
              } else {
                // If it's an Excel date number
                const date = XLSX.SSF.parse_date_code(cell);
                obj[index] = `${date.y}-${String(date.m).padStart(2, '0')}`;
              }
            } else {
              obj[index] = cell;
            }
          } else {
            obj[index] = cell;
          }
          return obj;
        }, {});
      });
      this.processData(data);
    };
    reader.readAsArrayBuffer(file);
  }

  processData(data) {
    // Skip empty rows and process each row
    data.forEach((row, index) => {
      if (Object.values(row).some(val => val != null)) {
        const tr = document.createElement('tr');
        const values = Object.values(row);

        // Process only the first 6 columns
        ['date', 'value', 'pre-min', 'pre-max', 'post-min', 'post-max'].forEach((col, i) => {
          const td = document.createElement('td');
          const input = document.createElement('input');

          if (i === 0) { // First column is always date
            input.type = 'month';
            input.min = '1900-01';
            input.max = '2100-12';

            let value = values[i];
            // Try to parse the date
            const parsedDate = utils.parseDate(value);
            if (parsedDate) {
              value = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
            }
            input.value = value;
          } else {
            input.type = 'number';
            input.step = '0.01';
            input.value = values[i] || '';
          }

          input.onchange = () => this.updatePlot();
          td.appendChild(input);
          tr.appendChild(td);
        });

        document.querySelector('#dataTable tbody').appendChild(tr);
      }
    });

    this.updatePlot();
  }

  updatePlot() {
    const data = this.getDataFromTable();
    const preColor = document.getElementById('preColor').value;
    const postColor = document.getElementById('postColor').value;
    const valueColor = document.getElementById('valueColor').value;

    // Get custom titles
    const chartTitle = document.getElementById('chartTitle').value;
    const xAxisTitle = document.getElementById('xAxisTitle').value;
    const yAxisTitle = document.getElementById('yAxisTitle').value;
    const preLabel = document.getElementById('preLabel').value;
    const postLabel = document.getElementById('postLabel').value;
    const valueLabel = document.getElementById('valueLabel').value;

    // Format dates for x-axis
    const months = data.date.map(d => utils.formatMonth(d));

    const traces = [
      // Pre-correction bars
      {
        x: months,
        y: data['pre-max'].map((max, i) => max - data['pre-min'][i]),
        base: data['pre-min'],
        type: 'bar',
        width: 0.6,
        marker: {
          color: preColor + '4D',
          pattern: {
            shape: '+',
            size: 3,
            solidity: 0.5,
            fgcolor: preColor
          },
          line: {
            color: preColor,
            width: 1
          }
        },
        name: preLabel
      },
      // Post-correction bars
      {
        x: months,
        y: data['post-max'].map((max, i) => max - data['post-min'][i]),
        base: data['post-min'],
        type: 'bar',
        width: 0.6,
        marker: {
          color: postColor + '4D',
          pattern: {
            shape: '.',
            size: 5,
            solidity: 0.5,
            fgcolor: postColor
          },
          line: {
            color: postColor,
            width: 1
          }
        },
        name: postLabel
      },
      // Value line and points
      {
        x: months,
        y: data.value,
        type: 'scatter',
        mode: 'lines+markers+text',
        marker: {
          size: 8,
          color: valueColor
        },
        line: {
          color: valueColor
        },
        text: data.value,
        textposition: 'bottom center',
        textfont: {
          color: valueColor
        },
        name: valueLabel
      }
    ];

    const layout = {
      title: chartTitle,
      xaxis: {
        title: xAxisTitle,
        showgrid: true,
        gridwidth: 0.1,
        gridcolor: 'lightgrey',
        side: 'bottom',
        zeroline: true,
        zerolinewidth: 1,
        zerolinecolor: 'black'
      },
      yaxis: {
        title: yAxisTitle,
        side: 'left',
        zeroline: true,
        zerolinewidth: 1,
        zerolinecolor: 'black'
      },
      template: 'plotly_white',
      showlegend: true,
      margin: {
        r: 150
      },
      barmode: 'overlay'
    };

    Plotly.newPlot('plot', traces, layout);
  }

  getDataFromTable() {
    const data = {
      date: [],
      value: [],
      'pre-min': [], 'pre-max': [],
      'post-min': [], 'post-max': []
    };

    const rows = document.querySelectorAll('#dataTable tbody tr');
    rows.forEach(row => {
      const inputs = row.querySelectorAll('input');
      const date = utils.parseDate(inputs[0].value);
      if (date) {
        data.date.push(date);
        data.value.push(Number(inputs[1].value));
        data['pre-min'].push(Number(inputs[2].value));
        data['pre-max'].push(Number(inputs[3].value));
        data['post-min'].push(Number(inputs[4].value));
        data['post-max'].push(Number(inputs[5].value));
      }
    });

    return data;
  }
} 