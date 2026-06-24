import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { generateInvoiceHtml, InvoiceData } from '@/lib/invoiceTemplate';

export async function POST(req: Request) {
  try {
    const data: InvoiceData = await req.json();

    // Validate required fields
    if (!data.invoiceNumber || !data.billToName || !data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'Missing required invoice data.' }, { status: 400 });
    }

    // Launch puppeteer
    // Note: for production on Vercel, this usually requires puppeteer-core and @sparticuz/chromium
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    const html = generateInvoiceHtml(data);
    
    await page.setContent(html, { waitUntil: 'load' });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });

    await browser.close();

    // Return the PDF
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="facture-${data.invoiceNumber}.pdf"`
      }
    });

  } catch (error: any) {
    console.error('Invoice Generation Error:', error); require('fs').writeFileSync('invoice-error.txt', error.stack || error.message || String(error));
    return NextResponse.json(
      { error: 'Failed to generate invoice.', details: error.message },
      { status: 500 }
    );
  }
}
