import ExcelJS from 'exceljs';

class AuditExcelExporter {
    constructor() {
        this.wb = new ExcelJS.Workbook();
        this.ws = null;
        this.headers = [];
    };

    createHeaders = (idColumnns=[], global={}, keys={}) => {
        this.idColumns = idColumnns;
        let set = new Set();

        for (const key of Object.keys(global)) set.add(key);
        
        for (const ext of Object.values(keys)) {
            for (const key of Object.keys(ext || {})) set.add(key);
        };
        
        set = [...set].sort();
        set.unshift(...idColumnns, 'type');

        this.headers = set;
    };

    createSheet(name) {
        this.ws = this.wb.addWorksheet(name);

        this.ws.columns = this.headers.map(h => ({ header: h, key: h, width: 46 }));
        this.ws.getRow(1).eachCell(cell => {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            cell.font = { bold: true }
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDFDFDF' } };
        });
    };

    addRow(ids={}, data) {
        const startRow = this.ws.rowCount + 1;
        const actualRowNumber = startRow;
        const expectedRowNumber = startRow + 1;

        const actualRow = {};
        const expectedRow = {};

        for (const col of this.idColumns) {
            actualRow[col] = ids[col] ?? '';
            expectedRow[col] = ids[col] ?? '';
        };

        const map = Object.fromEntries(data.map(x => [x.path, x]));

        for (const header of this.headers) {
            if (this.idColumns.includes(header)) continue;

            if (header === 'type') {
                actualRow[header] = 'CURRENT VALUE';
                expectedRow[header] = 'EXPECTED VALUE';

                continue;
            }

            const check = map[header];

            actualRow[header] = check?.actual ?? '';
            expectedRow[header] = check?.expected ?? '';
        }

        this.ws.addRow(actualRow);
        this.ws.addRow(expectedRow);

        for (let col = 1; col <= this.idColumns.length; col++) {
            this.ws.mergeCells(actualRowNumber, col, expectedRowNumber, col);

            const cell = this.ws.getRow(actualRowNumber).getCell(col);

            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
            cell.font = { bold: true, size: 13 };
        };

        for (let col = this.idColumns.length + 1; col <= this.headers.length; col++) {
            const actualCell = this.ws.getRow(actualRowNumber).getCell(col);
            const expectedCell = this.ws.getRow(expectedRowNumber).getCell(col);

            actualCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
            expectedCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

            actualCell.border = { top: { style: 'thin' }, bottom: { style: 'thin', color: { argb: 'FFADADAD' } } };
            expectedCell.border = { top: { style: 'thin', color: { argb: 'FFADADAD' } }, bottom: { style: 'thin' } };

            if (String(actualCell.value ?? '') !== String(expectedCell.value ?? '')) {
                if (actualCell.value === 'CURRENT VALUE') continue;
                if (expectedCell.value === 'EXPECTED VALUE') continue;

                actualCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } };
                expectedCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } };
            };
        };

        this.ws.getRow(actualRowNumber).height = 22;
        this.ws.getRow(expectedRowNumber).height = 22;
    };

    async write(fileName) {
        await this.wb.xlsx.writeFile(fileName);
    };
};

export default AuditExcelExporter;