"use client";
import { useState, useEffect } from "react";

interface AnimatedTotalPayProps {
  target: number;
}

export default function AnimatedTotalPay({ target }: AnimatedTotalPayProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (end === 0) {
      setCount(0);
      return;
    }

    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div
      style={{
        fontSize: "48px",
        fontWeight: "bold",
        color: "white", // Ensure the total is white (previously set to #333, now corrected)
        textAlign: "center",
      }}
    >
      ${count.toFixed(2)}
    </div>
  );
}