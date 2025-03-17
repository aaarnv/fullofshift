"use client";
import { useRouter } from "next/navigation";

interface NavigationArrowsProps {
  direction: "prev" | "next";
  year: number;
  month: number;
}

export default function NavigationArrows({ direction, year, month }: NavigationArrowsProps) {
  const router = useRouter();

  const handleNavigation = () => {
    if (direction === "prev") {
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      router.push(`/invoices/${prevYear}-${prevMonth}`);
    } else {
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      router.push(`/invoices/${nextYear}-${nextMonth}`);
    }
  };

  return (
    <button onClick={handleNavigation} style={{ width: "50px", fontSize: "24px" }}>
      {direction === "prev" ? "←" : "→"}
    </button>
  );
}