"use client";
import Link from "next/link";
import React from "react";
import "@radix-ui/themes/styles.css";
import { signOut } from "next-auth/react";

// Helper function to get the current month in YYYY-MM format
const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so +1, and pad with 0
  return `${year}-${month}`;
};

const NavBar = () => {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" }); // Redirect to login after logout
  };

  // Get the current month for the Invoices link
  const currentMonth = getCurrentMonth();

  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white">
      <div>
        <Link href="/dashboard" className="hover:text-gray-300 font-extrabold text-xl">
          Full of Shift
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/shifts" className="hover:text-gray-300">
          Shift Manager
        </Link>
        <Link href={`/invoices/${currentMonth}`} className="hover:text-gray-300">
          Invoices
        </Link>
        <button
          onClick={handleLogout}
          className="hover:bg-red-600 text-white px-4 py-2 outline-4 outline-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;