import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ReportData {
  month: string;        // "April 2026"
  monthKey: string;     // "2026-04"
  year: number;
  userEmail: string;
  awsAccountId: string;
  stats: {
    currentMonthCost: number;
    predictedMonthEnd: number;
    monthOverMonthChange: number;
    budgetUtilization: number;
    activeProjects: number;
  };
  services: { service: string; cost: number; percentage: number }[];
  daily: { day: number; date?: string; cost: number }[];
  budget?: { amount: number; month: string } | null;
}

export function generatePDFReport(data: ReportData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 16;
  let y = 0;

  // ── HEADER BAND ──────────────────────────────────────────────────────────
  doc.setFillColor(30, 64, 175); // blue-800
  doc.rect(0, 0, W, 38, "F");

  // Brand name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("FinSight", margin, 16);

  // Tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(147, 197, 253); // blue-300
  doc.text("AWS Cloud Cost Intelligence", margin, 22);

  // Report title right side
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("Monthly Cost Report", W - margin, 14, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(147, 197, 253);
  doc.text(data.month, W - margin, 21, { align: "right" });

  // Thin accent line
  doc.setFillColor(96, 165, 250); // blue-400
  doc.rect(0, 38, W, 1.5, "F");

  y = 48;

  // ── META INFO ─────────────────────────────────────────────────────────────
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}`, margin, y);
  doc.text(`Account: ${data.userEmail}`, W / 2, y, { align: "center" });
  doc.text(`AWS Account ID: ${data.awsAccountId || "N/A"}`, W - margin, y, { align: "right" });

  y += 10;

  // ── SUMMARY CARDS ─────────────────────────────────────────────────────────
  const cards = [
    { label: "Total Spend", value: `$${data.stats.currentMonthCost.toLocaleString()}`, color: [30, 64, 175] as [number,number,number] },
    { label: "Predicted Month-End", value: `$${data.stats.predictedMonthEnd.toLocaleString()}`, color: [109, 40, 217] as [number,number,number] },
    { label: "MoM Change", value: `${data.stats.monthOverMonthChange > 0 ? "+" : ""}${data.stats.monthOverMonthChange}%`, color: [5, 150, 105] as [number,number,number] },
    { label: "Budget Utilization", value: `${data.stats.budgetUtilization}%`, color: [234, 88, 12] as [number,number,number] },
  ];

  const cardW = (W - margin * 2 - 9) / 4;
  cards.forEach((card, i) => {
    const x = margin + i * (cardW + 3);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, cardW, 22, 2, 2, "F");
    doc.setDrawColor(...card.color);
    doc.setLineWidth(0.8);
    doc.line(x, y, x, y + 22);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(card.label, x + 4, y + 7);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...card.color);
    doc.text(card.value, x + 4, y + 17);
  });

  y += 30;

  // ── SERVICE BREAKDOWN TABLE ───────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Service Cost Breakdown", margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Service", "Cost (USD)", "% of Total"]],
    body: data.services.map(s => [
      s.service,
      `$${s.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `${s.percentage}%`,
    ]),
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "right" },
      2: { halign: "right" },
    },
    tableLineColor: [226, 232, 240],
    tableLineWidth: 0.2,
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // ── DAILY COSTS TABLE ─────────────────────────────────────────────────────
  if (data.daily.length > 0) {
    // Check if we need a new page
    if (y > 220) { doc.addPage(); y = 20; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("Daily Cost Breakdown", margin, y);
    y += 4;

    // Split into two columns to save space
    const half = Math.ceil(data.daily.length / 2);
    const col1 = data.daily.slice(0, half);
    const col2 = data.daily.slice(half);
    const rows = col1.map((d, i) => {
      const d2 = col2[i];
      return [
        d.date || `Day ${d.day}`,
        `$${d.cost.toFixed(2)}`,
        d2 ? (d2.date || `Day ${d2.day}`) : "",
        d2 ? `$${d2.cost.toFixed(2)}` : "",
      ];
    });

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Date", "Cost", "Date", "Cost"]],
      body: rows,
      headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: "bold", fontSize: 7 },
      bodyStyles: { fontSize: 7, textColor: [30, 41, 59] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 1: { halign: "right" }, 3: { halign: "right" } },
      tableLineColor: [226, 232, 240],
      tableLineWidth: 0.2,
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // ── BUDGET SECTION ────────────────────────────────────────────────────────
  if (data.budget) {
    if (y > 240) { doc.addPage(); y = 20; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("Budget Summary", margin, y);
    y += 6;

    const budgetAmt = data.budget.amount;
    const spent = data.stats.currentMonthCost;
    const remaining = budgetAmt - spent;
    const exceeded = spent > budgetAmt;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Metric", "Value"]],
      body: [
        ["Budget Set", `$${budgetAmt.toLocaleString()}`],
        ["Amount Spent", `$${spent.toLocaleString()}`],
        ["Remaining / Over", exceeded ? `-$${Math.abs(remaining).toLocaleString()} (EXCEEDED)` : `$${remaining.toLocaleString()}`],
        ["Utilization", `${data.stats.budgetUtilization}%`],
      ],
      headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: "bold", fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 1: { halign: "right" } },
      tableLineColor: [226, 232, 240],
      tableLineWidth: 0.2,
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // ── FOOTER ────────────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 285, W, 12, "F");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.text("Generated with FinSight — AWS Cloud Cost Intelligence", margin, 291);
    doc.text(`Page ${p} of ${pageCount}`, W - margin, 291, { align: "right" });
  }

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const filename = `FinSight_Report_${data.monthKey}.pdf`;
  doc.save(filename);
}
