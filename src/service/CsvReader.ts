import Papa from 'papaparse';

export interface CsvRow {
  [key: string]: string;
}

class CsvService {
  private static csvPath = '/IPL_2025.csv';

  static async readCsv(): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
      fetch(this.csvPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch CSV file: ${response.statusText}`);
          }
          return response.text();
        })
        .then(csvText => {
          Papa.parse<CsvRow>(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (result:any) => resolve(result.data),
            error: (error:any) => reject(error),
          });
        })
        .catch(error => reject(error));
    });
  }
}

export default CsvService;