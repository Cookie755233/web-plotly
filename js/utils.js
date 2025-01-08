const utils = {
  parseDate(dateStr) {
    if (!dateStr) return null;

    // Handle month number input (1-12)
    if (!isNaN(dateStr)) {
      const month = parseInt(dateStr);
      if (month < 1 || month > 12) return null;
      return new Date(2025, month - 1, 1);
    }

    // Handle MMM-YY format (e.g., Jan-24)
    const monthYearRegex = /^([A-Za-z]{3})-(\d{2})$/;
    const monthYearMatch = dateStr.match(monthYearRegex);
    if (monthYearMatch) {
      const month = new Date(Date.parse(monthYearMatch[1] + " 1, 2000")).getMonth();
      const year = 2000 + parseInt(monthYearMatch[2]);
      return new Date(year, month, 1);
    }

    // Handle various date formats
    const formats = [
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,  // yyyy-mm-dd
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,  // yyyy/mm/dd
      /^(\d{4})-(\d{1,2})$/,  // yyyy-mm
      /^(\d{4})\/(\d{1,2})$/  // yyyy/mm
    ];

    for (let format of formats) {
      const match = dateStr.match(format);
      if (match) {
        const year = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const day = match[3] ? parseInt(match[3]) : 1;
        if (month < 0 || month > 11) return null;
        if (day < 1 || day > 31) return null;
        return new Date(year, month, 1); // Always use 1st day of month
      }
    }

    return null;
  },

  formatMonth(date) {
    return date.toLocaleString('default', { month: 'short', year: '2-digit' });
  }
};