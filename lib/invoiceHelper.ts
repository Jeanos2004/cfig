export async function downloadInvoice(courseTitle: string, price: number, userName: string, invoiceId?: string) {
  try {
    const invoiceData = {
      invoiceNumber: invoiceId || Math.floor(Math.random() * 10000).toString(),
      billToName: userName,
      billToAddress: "Adresse de l'étudiant\nConakry, Guinée",
      date: new Date().toLocaleDateString("fr-FR"),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
      terms: "Paiement à réception",
      items: [
        {
          description: courseTitle,
          unit: "Formation",
          qty: 1,
          rate: price || 1500000,
          amount: price || 1500000
        }
      ],
      subtotal: price || 1500000,
      discountPct: 0,
      discountAmount: 0,
      total: price || 1500000,
    };

    const response = await fetch('/api/invoice/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      throw new Error('Failed to generate invoice');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Facture-${invoiceData.invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    alert("Erreur lors de la génération de la facture.");
  }
}
