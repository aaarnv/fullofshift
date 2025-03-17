"use client";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface DownloadPDFButtonProps {
  user: {
    name: string | null;
    email: string | null;
    wagePerHour: number | null;
    contactNumber: string | null;
  };
  shifts: Array<{
    id: number;
    class: string;
    grade: string;
    date: string;
    startTime: string;
    endTime: string;
  }>;
  totalHours: number;
  totalPay: number;
  year: number;
  month: number;
}

export default function DownloadPDFButton({
  user,
  shifts,
  totalHours,
  totalPay,
  year,
  month,
}: DownloadPDFButtonProps) {
  const parseTimeToHours = (time: string) => {
    const [hours] = time.split(":").map(Number);
    return hours;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text(user.name || "N/A", 20, 20);
    doc.setFontSize(12);
    doc.text(`Contact number: ${user.contactNumber || "N/A"}`, 20, 30);
    doc.text(`Email: ${user.email || "N/A"}`, 20, 40);
    doc.text("Bill to: Cosmos Coaching Centre", 20, 50);

    // Invoice Details
    doc.setFontSize(14);
    doc.text(`Invoice No. ${shifts.length > 0 ? shifts[0].id : "N/A"}`, 20, 70);
    doc.text(`Date: ${format(new Date(), "dd/MM/yy")}`, 20, 80);

    // Table setup
    const tableData = shifts.map((shift) => {
      const shiftDate = new Date(shift.date);
      const day = shiftDate.toLocaleString("en-US", { weekday: "long" });
      const formattedDate = format(shiftDate, "dd.MM.yy");
      const hours = parseTimeToHours(shift.endTime) - parseTimeToHours(shift.startTime);
      const wage = user.wagePerHour ? hours * user.wagePerHour : 0;

      return [
        `${shift.class} - ${shift.grade}`,
        day,
        formattedDate,
        hours.toString(),
        wage.toString(),
      ];
    });

    // Add total row
    tableData.push(["TOTAL", "", "", totalHours.toString(), totalPay.toString()]);

    // Add table to PDF
    autoTable(doc, {
      startY: 90,
      head: [["Class Description", "Day", "Date", "Hours", "Wage"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0], fontSize: 12, fontStyle: "bold" },
      styles: { textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0] },
      bodyStyles: { fontSize: 10 },
    });

    // Add bank details
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 90;
    doc.setFontSize(12);
    doc.text("Bank Details:", 20, finalY + 20);
    doc.text(user.name || "N/A", 20, finalY + 30);
    doc.text("BSB: 062 443", 20, finalY + 40);
    doc.text("Account No: 11467258", 20, finalY + 50);

    // Download the PDF
    doc.save(`invoice-${year}-${month}.pdf`);
  };

  return (
    <button
      onClick={handleDownloadPDF}
      style={{
        position: "absolute",
        top: "15px",
        right: "15px",
        backgroundColor: "black",
        color: "white",
        padding: "8px 16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "bold",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        zIndex: 10, // Ensure it stays above the document
      }}
    >
      Download PDF
    </button>
  );
}