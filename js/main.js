class MainHandler {
  constructor() {
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.querySelector('[onclick="addRow()"]').onclick = () => this.addRow();
  }

  addRow() {
    const tbody = document.querySelector('#dataTable tbody');
    const row = document.createElement('tr');

    const columns = ['date', 'value', 'pre-min', 'pre-max', 'post-min', 'post-max'];
    columns.forEach(col => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      if (col === 'date') {
        input.type = 'month';
        input.min = '1900-01';
        input.max = '2100-12';
      } else {
        input.type = 'number';
        input.step = '0.01';
      }
      input.onchange = () => window.plotHandler.updatePlot();
      td.appendChild(input);
      row.appendChild(td);
    });

    tbody.appendChild(row);
  }
}

// Initialize handlers
window.dataHandler = new DataHandler();
window.plotHandler = new PlotHandler();
window.mainHandler = new MainHandler();

// Initialize
window.onload = () => {
  window.mainHandler.addRow();
  window.plotHandler.updatePlot();
};

// Make addRow globally available
window.addRow = () => window.mainHandler.addRow();