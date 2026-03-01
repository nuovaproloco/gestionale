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
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets['Dettaglio Incassi'] || workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

            const results: IncassoData[] = [];
            // Inizia dalla riga 3 (dopo gli header)
            for (let i = 3; i < json.length; i++) {
                const row = json[i];
                if (!row || row.length < 10) continue;

                const dataStr = row[2]; // Data spettacolo
                if (!dataStr || dataStr === 'Data spettacolo') continue;

                const bigliettiFisici = parseInt(row[4] || '0') + parseInt(row[6] || '0'); // Numero Contanti + Numero Carte
                const incassoContanti = parseFloat(row[5] || '0'); // Importo Contanti
                const incassoPos = parseFloat(row[7] || '0'); // Importo Carte
                const bigliettiOnline = parseInt(row[8] || '0'); // Numero Sito

                results.push({
                    data: dataStr,
                    bigliettiFisici,
                    incassoContanti,
                    incassoPos,
                    bigliettiOnline
                });
            }
            resolve(results);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function formattaData(data: string): string {
    // Converte da "16/01/2026" o altri formati a testo leggibile
    if (data.includes('/')) {
        const [giorno, mese, anno] = data.split('/');
        const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        const dateObj = new Date(parseInt(anno), parseInt(mese) - 1, parseInt(giorno));
        return `${giorni[dateObj.getDay()]} ${data}`;
    }
    return data;
}

export async function generaReportHTML(file: File): Promise<string> {
    const dati = await parseFile(file);

    if (dati.length === 0) {
        return '<p>Nessun dato trovato nel file.</p>';
    }

    let htmlOutput = '';

    dati.forEach((row, index) => {
        const dataFormattata = formattaData(row.data);
        const incassoBiglietteria = row.incassoContanti + row.incassoPos;
        const incassoGlobale = incassoBiglietteria + (row.bigliettiOnline * 6);

        htmlOutput += `
<div class="report-proiezione">
  <strong>Proiezione ${dataFormattata}</strong><br>
  Biglietti venduti online (come riportato sul sito 18tickets): ${row.bigliettiOnline}<br>
  Biglietti venduti fisicamente presso la biglietteria: ${row.bigliettiFisici}<br>
  Incasso contanti: ${row.incassoContanti.toFixed(2).replace('.', ',')} euro<br>
  Incasso Pos: ${row.incassoPos.toFixed(2).replace('.', ',')} euro<br>
  Incasso totale presso la biglietteria (contanti + pos) = ${incassoBiglietteria.toFixed(2).replace('.', ',')} euro<br>
  Incasso Globale (online compresi di prevendita + fisici) = ${incassoBiglietteria.toFixed(2).replace('.', ',')} + ${row.bigliettiOnline} x 6,00 euro = ${incassoGlobale.toFixed(2).replace('.', ',')} euro
</div>
${index < dati.length - 1 ? '<hr>' : ''}
    `.trim();
    });

    return htmlOutput;
}
