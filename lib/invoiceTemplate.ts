export interface InvoiceItem {
  description: string;
  unit: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  billToName: string;
  billToAddress: string;
  billToVAT?: string;
  date: string;
  dueDate: string;
  terms: string;
  items: InvoiceItem[];
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  total: number;
  notes?: string;
}

export function generateInvoiceHtml(data: InvoiceData): string {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', minimumFractionDigits: 0 }).format(amount);
  };

  const itemsHtml = data.items.map((item, index) => `
    <tr class="item-row">
      <td class="col-id">${index + 1}</td>
      <td class="col-desc">${item.description}</td>
      <td class="col-unit">${item.unit}</td>
      <td class="col-qty">${item.qty}</td>
      <td class="col-rate">${formatCurrency(item.rate)}</td>
      <td class="col-amount">${formatCurrency(item.amount)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Facture #${data.invoiceNumber}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          background: #ffffff;
          color: #333333;
          -webkit-font-smoothing: antialiased;
        }

        .invoice-container {
          padding: 60px 80px;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Header / Logo section */
        .logo-box {
          width: 48px;
          height: 48px;
          background-color: #0A346E;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 14px;
          margin-bottom: 24px;
        }

        .company-info {
          font-size: 11px;
          color: #555555;
          line-height: 1.5;
          margin-bottom: 60px;
        }

        .company-info strong {
          font-weight: 600;
          color: #111;
        }

        /* Invoice Title */
        .invoice-title {
          font-size: 28px;
          font-weight: 700;
          color: #0A346E;
          margin: 0 0 40px 0;
        }

        /* Meta Grid */
        .meta-grid {
          display: flex;
          gap: 60px;
          margin-bottom: 40px;
        }

        .meta-block h4 {
          font-size: 9px;
          text-transform: uppercase;
          color: #999999;
          letter-spacing: 1px;
          margin: 0 0 10px 0;
        }

        .meta-block p {
          margin: 0;
          font-size: 12px;
          color: #333333;
          line-height: 1.5;
        }

        /* Table */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }

        th {
          font-size: 9px;
          text-transform: uppercase;
          color: #999999;
          letter-spacing: 1px;
          text-align: left;
          padding-bottom: 12px;
          border-bottom: 1px solid #eeeeee;
          font-weight: 600;
        }

        td {
          padding: 16px 0;
          font-size: 12px;
          color: #333333;
          border-bottom: 1px solid #eeeeee;
        }

        th.col-id, td.col-id { width: 5%; }
        th.col-desc, td.col-desc { width: 40%; font-weight: 500; }
        th.col-unit, td.col-unit { width: 10%; }
        th.col-qty, td.col-qty { width: 10%; }
        th.col-rate, td.col-rate { width: 15%; text-align: right; }
        th.col-amount, td.col-amount { width: 20%; text-align: right; font-weight: 600; }

        /* Footer / Totals */
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 40px;
        }

        .notes {
          width: 50%;
        }

        .notes h4 {
          font-size: 9px;
          text-transform: uppercase;
          color: #999999;
          letter-spacing: 1px;
          margin: 0 0 10px 0;
        }

        .notes p {
          margin: 0 0 20px 0;
          font-size: 11px;
          color: #666666;
          line-height: 1.6;
        }

        .totals {
          width: 35%;
        }

        .totals-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 11px;
          font-weight: 600;
          color: #666666;
        }

        .totals-row.total-final {
          border-top: 1px solid #eeeeee;
          padding-top: 20px;
          margin-top: 8px;
          font-size: 14px;
          color: #0A346E;
          font-weight: 700;
          align-items: center;
        }

        .totals-row.total-final span:last-child {
          font-size: 18px;
          font-weight: 800;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        
        <div class="logo-box">CFIG</div>
        
        <div class="company-info">
          <strong>CFIG Guinée</strong><br>
          Quartier Kipé, Commune de Ratoma<br>
          Conakry, République de Guinée<br>
          Tel: +224 620 00 00 00
        </div>

        <h1 class="invoice-title">Facture #${data.invoiceNumber}</h1>

        <div class="meta-grid">
          <div class="meta-block" style="flex: 2;">
            <h4>Facturé à</h4>
            <p>
              <strong>${data.billToName}</strong><br>
              ${data.billToAddress.replace(/\n/g, '<br>')}<br>
              ${data.billToVAT ? `NIF: ${data.billToVAT}` : ''}
            </p>
          </div>
          <div class="meta-block" style="flex: 1;">
            <h4>Date</h4>
            <p>${data.date}</p>
          </div>
          <div class="meta-block" style="flex: 1;">
            <h4>Échéance</h4>
            <p>${data.dueDate}</p>
          </div>
          <div class="meta-block" style="flex: 1;">
            <h4>Conditions</h4>
            <p>${data.terms}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="col-id">#</th>
              <th class="col-desc">DESCRIPTION</th>
              <th class="col-unit">UNITÉ</th>
              <th class="col-qty">QTÉ</th>
              <th class="col-rate">PRIX UNIT.</th>
              <th class="col-amount">MONTANT</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div class="notes">
            <h4>Notes</h4>
            <p>${data.notes || "Veuillez effectuer le paiement sur notre compte bancaire Ecobank.<br>Numéro de compte: XXXXXXXX<br>Code banque: XXXX"}</p>
            <p>Merci pour votre confiance !</p>
          </div>
          
          <div class="totals">
            <div class="totals-row">
              <span>SOUS-TOTAL</span>
              <span>${formatCurrency(data.subtotal)}</span>
            </div>
            ${data.discountPct > 0 ? `
            <div class="totals-row">
              <span>REMISE (${data.discountPct}%)</span>
              <span>-${formatCurrency(data.discountAmount)}</span>
            </div>
            ` : ''}
            <div class="totals-row total-final">
              <span>TOTAL</span>
              <span>${formatCurrency(data.total)}</span>
            </div>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;
}
