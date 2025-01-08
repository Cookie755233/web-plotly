# Data Visualization Tool

A web-based tool for visualizing PM2.5 concentration data with pre and post-correction intervals. This tool allows users to upload data via CSV/Excel files or input data manually, and generates interactive plots using Plotly.js.

## Features

- Upload data via CSV or Excel files
- Manual data input with real-time plotting
- Customizable chart settings:
  - Chart title
  - Axis labels
  - Legend labels
  - Colors for different data series
- Interactive plot with zoom and pan capabilities
- Support for various date formats

## Data Format

The tool accepts CSV and Excel files with the following column structure:

### Required Columns (in order)
1. Date/Month (First column)
2. Value
3. Pre-min
4. Pre-max
5. Post-min
6. Post-max

### Supported Date Formats
- YYYY-MM-DD (e.g., 2024-03-15)
- YYYY/MM/DD (e.g., 2024/03/15)
- YYYY-MM (e.g., 2024-03)
- YYYY/MM (e.g., 2024/03)
- MMM-YY (e.g., Jan-24)
- Month number (1-12, defaults to 2025)

### Example CSV Format

```
Date/Month,Value,Pre-min,Pre-max,Post-min,Post-max
2024-03-15,10,5,15,10,20
2024-03-16,12,6,16,11,21
```


### Example Excel Format
The Excel file should follow the same column structure as the CSV format.

## Usage

1. **Data Input**:
   - Upload a CSV/Excel file using the "Upload CSV/Excel" button, or
   - Click "Add Row" to manually input data

2. **Chart Customization**:
   - Modify chart title, axis labels, and legend labels
   - Customize colors for pre-correction, post-correction, and value lines
   - Click "Update Chart" to apply changes

3. **Data Management**:
   - Select rows to delete them
   - Use the Reset button to clear all data

## Development

This project uses:
- Plotly.js for charting
- PapaParse for CSV parsing
- SheetJS for Excel file handling
- Material Design for UI components

## Deployment

The tool is deployed using Vercel and can be accessed at [web-ploty (hosted on vercel)](https://web-plotly.vercel.app/).

## Local Development

To run this project locally:
1. Clone the repository
2. Open index.html in a web browser
3. No build process or server required

## License

MIT License