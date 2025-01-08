class DataHandler {
  constructor() {
    this.selectedRow = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Row selection
    document.querySelector('#dataTable tbody').addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      if (row) {
        this.handleRowSelection(row);
      }
    });

    // Delete button
    document.getElementById('deleteRowBtn').addEventListener('click', () => {
      this.deleteSelectedRow();
    });

    // Reset button
    document.getElementById('restartBtn').addEventListener('click', () => {
      this.resetData();
    });
  }

  handleRowSelection(row) {
    const wasSelected = row.classList.contains('selected');
    document.querySelectorAll('#dataTable tbody tr').forEach(r => {
      r.classList.remove('selected');
    });

    if (!wasSelected) {
      row.classList.add('selected');
      this.selectedRow = row;
      document.getElementById('deleteRowBtn').disabled = false;
    } else {
      this.selectedRow = null;
      document.getElementById('deleteRowBtn').disabled = true;
    }
  }

  deleteSelectedRow() {
    if (this.selectedRow) {
      this.selectedRow.remove();
      this.selectedRow = null;
      document.getElementById('deleteRowBtn').disabled = true;
      window.plotHandler.updatePlot();
    }
  }

  resetData() {
    document.querySelector('#dataTable tbody').innerHTML = '';
    addRow();
    window.plotHandler.updatePlot();
  }

  getTableData() {
    // ... existing getDataFromTable logic ...
  }
}