import * as XLSX from 'xlsx';

interface IncassoData {
    data: string;
    bigliettiFisici: number;
    incassoContanti: number;
    incassoPos: number;
    bigliettiOnline: number;
}

function parseFile(file: File): Promise<IncassoData[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheet = workbook.Sheets['Dettaglio Incassi'] || workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, {header: 1}) as string[][];

            const results: IncassoData[] = [];
            for (let i = 3; i < json.length; i++) { // Salta header
                const row = json[i];
                if (row.length < 6 || !row[2]) continue;
                const dataStr = row[2] as string;
                const bigliettiFisici = parseInt(row[3] || '0');
                const incassoContanti = parseFloat(row[4] || '0');
                const incassoPos = parseFloat(row[6] || '0');
                const bigliettiOnline = parseInt(row[9] || '0');

                results.push({data: dataStr, bigliettiFisici, incassoContanti, incassoPos, bigliettiOnline});
            }
            resolve(results);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

export async function generaReportHTML(file: File, dataProiezione: string): Promise<string> {
    const dati = await parseFile(file);
    const row = dati.find(r => r.data === dataProiezione);
    if (!row) return 'Dati non trovati per la data specificata.';

    const dataItaliana = dataProiezione.replace(/(\d{2})(\d{2})(\d{4})/, '$1.$2.$3');
    const incassoBiglietteria = row.incassoContanti + row.incassoPos;
    const incassoGlobale = incassoBiglietteria + (row.bigliettiOnline * 6);

    return `
Proiezione ${dataItaliana}<br>
Biglietti venduti online (come riportato sul sito 18tickets): ${row.bigliettiOnline}<br>
Biglietti venduti fisicamente presso la biglietteria: ${row.bigliettiFisici}<br>
Incasso contanti: ${row.incassoContanti.toFixed(2).replace('.', ',')} euro<br>
Incasso Pos: ${row.incassoPos.toFixed(2).replace('.', ',')} euro<br>
Incasso totale presso la biglietteria (contanti + pos) = ${incassoBiglietteria.toFixed(2).replace('.', ',')} euro<br>
Incasso Globale (online compresi di prevendita + fisici) = ${incassoBiglietteria.toFixed(2).replace('.', ',')} + ${row.bigliettiOnline} x 6,00 euro = ${incassoGlobale.toFixed(2).replace('.', ',')} euro
  `.trim();
}
