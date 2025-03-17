import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/useAuth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "../components/LogoutButton";

// Helper to get the current YYYY-MM format
const getCurrentMonthYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() is 0-based, so add 1
  return `${year}-${month}`; // e.g., "2025-3" for March 2025
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (!session.user.role) {
    redirect("/login/complete-profile");
  }

  // Get the current month and year for the invoices link
  const currentMonthYear = getCurrentMonthYear();

  return (
    <div className="min-h-screen p-6 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <LogoutButton />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-15 w-full max-w-4xl">
          {/* Shifts Button - Left Half */}
          <Link href="/shifts" className="flex justify-center items-center">
            <Button
              variant="ghost"
              size="lg"
              className="w-full h-40 text-2xl font-semibold text-white"
            >
              SHIFTS
            </Button>
          </Link>
          {/* Invoices Button - Right Half */}
          <Link href={`/invoices/${currentMonthYear}`} className="flex justify-center items-center">
            <Button
              variant="ghost"
              size="lg"
              className="w-full h-40 text-2xl font-semibold text-white"
            >
              INVOICES
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}