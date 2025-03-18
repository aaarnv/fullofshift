import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import prisma from "@/prisma/client";
import NavigationArrows from "./NavigationArrows";
import DownloadPDFButton from "./DownloadPDFButton";
import AnimatedTotalPay from "./AnimatedTotalPay";
import NavBar from "@/app/components/NavBar";

// Helper function defined outside the component
const parseTimeToHours = (time: string) => {
  const [hours] = time.split(":").map(Number);
  return hours;
};

// Helper function to format the month and year as "Month YYYY"
const formatMonthYear = (year: number, month: number) => {
  const date = new Date(year, month - 1); // month is 1-based, Date expects 0-based
  return format(date, "MMMM yyyy"); // e.g., "March 2025"
};

// Helper function to determine shift status
const getShiftStatus = (shiftDate: Date, startTime: string, endTime: string) => {
  const now = new Date();
  const shiftStart = new Date(shiftDate);
  const [startHours] = startTime.split(":").map(Number);
  shiftStart.setHours(startHours, 0, 0, 0);

  const shiftEnd = new Date(shiftDate);
  const [endHours] = endTime.split(":").map(Number);
  shiftEnd.setHours(endHours, 0, 0, 0);

  if (shiftEnd < now) return "Logged";
  if (shiftStart <= now && shiftEnd >= now) return "Pending";
  return "Upcoming";
};

// Explicitly define the props type for the component
interface InvoicePageProps {
  params: Promise<{ month: string }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    console.log("No session or user ID, redirecting to /login");
    redirect("/login");
  }

  // Await the params to handle it as a promise
  const resolvedParams = await params;
  const monthParam = resolvedParams.month;
  const [year, month] = monthParam.split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) {
    console.log("Invalid month format:", resolvedParams.month);
    return new Response("Invalid month format", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      wagePerHour: true,
      contactNumber: true,
      managerName: true,
      bsb: true,
      accountNumber: true,
    },
  });

  if (!user) {
    console.log("User not found for ID:", session.user.id);
    return new Response("User not found", { status: 404 });
  }

  // Check for missing required details and redirect to complete profile
  if (!user.wagePerHour || !user.contactNumber || !user.managerName || !user.bsb || !user.accountNumber) {
    console.log("Incomplete profile, redirecting to /login/complete-profile");
    redirect("/login/complete-profile");
  }

  // Fetch the user's shifts
  const shifts = await prisma.shift.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      class: true,
      grade: true,
      date: true,
      startTime: true,
      endTime: true,
    },
  });

  console.log("Shifts fetched:", shifts.length);

  // Calculate the total hours and pay for the current month
  const filteredShifts = shifts
  .filter((shift) => {
    const shiftDate = new Date(shift.date);
    return shiftDate.getFullYear() === year && shiftDate.getMonth() + 1 === month;
  })
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalHours = filteredShifts.reduce((total, shift) => {
    const start = parseTimeToHours(shift.startTime);
    const end = parseTimeToHours(shift.endTime);
    const hours = end - start;
    return total + hours;
  }, 0);

  const totalPay = user.wagePerHour ? totalHours * user.wagePerHour : 0;

  const monthYear = formatMonthYear(year, month);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <NavBar />
      <div style={{ display: "flex", flex: 1 }}>
        <NavigationArrows direction="prev" year={year} month={month} />

        {/* Left Side: Invoice Preview */}
        <div
          style={{
            flex: 1,
            padding: "0",
            position: "relative",
            background: "black", 
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch", 
            height: "100%", 
          }}
        >
          <div
            style={{
              width: "100%", 
              maxWidth: "none", 
              backgroundColor: "#fff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              borderRadius: "8px",
              padding: "20px", 
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
              position: "relative", 
              height: "100%", 
              overflow: "auto", 
            }}
          >
            <h1
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#000",
              }}
            >
              {user.name}
            </h1>
            <p style={{ marginBottom: "5px", color: "#000" }}>
              Contact number: {user.contactNumber}
            </p>
            <p style={{ marginBottom: "5px", color: "#000" }}>
              Email: {user.email}
            </p>
            <p style={{ marginBottom: "15px", color: "#000" }}>
              Bill to: {user.managerName}
            </p>

            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#000",
              }}
            >
              Invoice for {monthYear}
            </h2>
            <p style={{ marginBottom: "15px", color: "#000" }}>
              Date: {format(new Date(), "dd/MM/yy")}
            </p>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
                fontSize: "12px",
                color: "#000",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      border: "1px solid #000",
                      color: "#000",
                      width: "80px", 
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    Class Description
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    Day
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    Hours
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    Wage
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredShifts.map((shift) => {
                  const shiftDate = new Date(shift.date);
                  const day = shiftDate.toLocaleString("en-US", { weekday: "long" });
                  const formattedDate = format(shiftDate, "dd.MM.yy");
                  const hours = parseTimeToHours(shift.endTime) - parseTimeToHours(shift.startTime);
                  const wage = user.wagePerHour ? hours * user.wagePerHour : 0;
                  const status = getShiftStatus(shiftDate, shift.startTime, shift.endTime);

                  return (
                    <tr key={shift.id}>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #000",
                          color: "#000",
                          width: "80px", 
                        }}
                      >
                        {status}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #000",
                          color: "#000",
                        }}
                      >
                        {shift.class} - {shift.grade}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #000",
                          color: "#000",
                        }}
                      >
                        {day}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #000",
                          color: "#000",
                        }}
                      >
                        {formattedDate}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #000",
                          color: "#000",
                        }}
                      >
                        {hours}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #000",
                          color: "#000",
                        }}
                      >
                        {wage}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td
                    colSpan={4} 
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      border: "1px solid #000",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    TOTAL
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    {totalHours}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    {totalPay}
                  </td>
                </tr>
              </tbody>
            </table>

            <h3
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#000",
              }}
            >
              Bank Details:
            </h3>
            <p style={{ marginBottom: "5px", color: "#000" }}>{user.name}</p>
            <p style={{ marginBottom: "5px", color: "#000" }}>BSB: {user.bsb}</p>
            <p style={{ marginBottom: "5px", color: "#000" }}>Account No: {user.accountNumber}</p>
          </div>

          <DownloadPDFButton
            user={user}
            shifts={filteredShifts.map((shift) => ({
              ...shift,
              date: shift.date.toISOString(),
            }))}
            totalHours={totalHours}
            totalPay={totalPay}
            year={year}
            month={month}
          />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Arial, sans-serif",
            color: "white",
            background: "black",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "white",
            }}
          >
            {monthYear}
          </h2>
          <AnimatedTotalPay target={totalPay} />
        </div>

        <NavigationArrows direction="next" year={year} month={month} />
      </div>
    </div>
  );
}