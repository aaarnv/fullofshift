"use client";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";

interface NavigationArrowsProps {
  direction: "prev" | "next";
  year: number;
  month: number;
}

export default function NavigationArrows({ direction, year, month }: NavigationArrowsProps) {
  const router = useRouter();

  const handleNavigation = useCallback(
    (dir: "prev" | "next") => {
      if (dir === "prev") {
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        router.push(`/invoices/${prevYear}-${prevMonth}`);
      } else {
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        router.push(`/invoices/${nextYear}-${nextMonth}`);
      }
    },
    [router, year, month] // Dependencies for handleNavigation
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handleNavigation("prev");
      } else if (event.key === "ArrowRight") {
        handleNavigation("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNavigation]); 

  return (
    <button
      onClick={() => handleNavigation(direction)}
      style={{ width: "50px", fontSize: "24px" }}
    >
      {direction === "prev" ? "←" : "→"}
    </button>
  );
}