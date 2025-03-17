import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import { Status } from "@prisma/client";

interface Shift {
  id: number;
  class: string;
  grade: string;
  status: Status;
  date: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
  userId: string;
}
interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  wagePerHour: number | null;
  contactNumber: string | null;
  managerName: string | null;
  address?: string | null;
  abn?: string | null;
}
// Styles for the PDF
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  header: { 
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: 10,
    marginBottom: 20
  },
  contactItem: {
    marginHorizontal: 5
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    padding: 4,
    backgroundColor: '#f0f0f0'
  },
  twoColumn: {
    flexDirection: 'row',
    marginBottom: 10
  },
  column: {
    flex: 1
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
    marginBottom: 10
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  tableCol: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
    padding: 5,
    flex: 1,
  },
  tableColLast: {
    borderRightWidth: 0,
    padding: 5,
    flex: 1,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  tableHeaderCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
    flex: 1,
    fontWeight: 'bold'
  },
  tableHeaderCellLast: {
    padding: 5,
    flex: 1,
    fontWeight: 'bold'
  },
  totalRow: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  text: {
    marginBottom: 4,
  },
  textBold: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  textCenter: {
    textAlign: 'center'
  },
  textRight: {
    textAlign: 'right'
  }
});

// PDF Component for Invoice
export const InvoicePDF: React.FC<{ user: User; shifts: Shift[]; month: string }> = ({ user, shifts, month }) => {
  // Calculate totals
  const hoursPerShift = 2; // Default hours per shift
  const totalHours = shifts.length * hoursPerShift;
  const wagePerHour = user.wagePerHour || 40;
  const totalWage = totalHours * wagePerHour;
  const invoiceNumber = Math.floor(Math.random() * 1000);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{user.name?.toUpperCase() || "UNKNOWN NAME"}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>{user.email || "email@example.com"}</Text>
            <Text style={styles.contactItem}>|</Text>
            <Text style={styles.contactItem}>{user.contactNumber}</Text>
            <Text style={styles.contactItem}>|</Text>
          </View>
        </View>
        
        {/* Invoice Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INVOICE DETAILS</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.text}>Invoice No: {invoiceNumber}</Text>
              <Text style={styles.text}>Date: {month}</Text>
              <Text style={styles.text}>ABN: {user.abn}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.text}>Bill to: Cosmos Coaching Centre</Text>
              <Text style={styles.text}>Tutor Name: {user.name || "Unknown Name"}</Text>
            </View>
          </View>
        </View>
        
        {/* Class Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CLASS DETAILS</Text>
          
          {shifts.length > 0 ? (
            <View style={styles.table}>
              {/* Header Row */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableHeaderCell}>Class Description</Text>
                <Text style={styles.tableHeaderCell}>Day</Text>
                <Text style={styles.tableHeaderCell}>Date</Text>
                <Text style={styles.tableHeaderCell}>Hours</Text>
                <Text style={styles.tableHeaderCellLast}>Wage</Text>
              </View>
              
              {/* Data Rows */}
              {shifts.map((shift) => {
                const date = new Date(shift.date);
                const hours = hoursPerShift;
                const shiftWage = hours * wagePerHour;
                
                return (
                  <View style={styles.tableRow} key={shift.id}>
                    <Text style={styles.tableCol}>{`Adi Substitute - ${shift.class}`}</Text>
                    <Text style={styles.tableCol}>{format(date, "EEEE")}</Text>
                    <Text style={styles.tableCol}>{format(date, "dd/MM/yy")}</Text>
                    <Text style={[styles.tableCol, styles.textCenter]}>{hours}</Text>
                    <Text style={[styles.tableColLast, styles.textRight]}>${shiftWage}</Text>
                  </View>
                );
              })}
              
              {/* Total Row */}
              <View style={[styles.tableRow, styles.totalRow]}>
                <Text style={styles.tableCol}>Total</Text>
                <Text style={styles.tableCol}></Text>
                <Text style={styles.tableCol}></Text>
                <Text style={[styles.tableCol, styles.textCenter]}>{totalHours}</Text>
                <Text style={[styles.tableColLast, styles.textRight]}>${totalWage}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.text}>No shifts found for this period.</Text>
          )}
        </View>
        
        {/* Payment Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PAYMENT DETAILS</Text>
          <Text style={styles.text}>Bank Details:</Text>
          <Text style={styles.text}>{user.name || "Unknown Name"}</Text>
          <Text style={styles.text}>BSB: 062 443</Text>
          <Text style={styles.text}>Account No: 11467258</Text>
        </View>
        
        {/* Footer */}
        <View style={{ position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center' }}>
          <Text style={{ fontSize: 10, color: '#666' }}>Thank you for your business</Text>
        </View>
      </Page>
    </Document>
  );
};