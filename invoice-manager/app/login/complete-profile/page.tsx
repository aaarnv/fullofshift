"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function CompleteProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [role, setRole] = useState("");
  const [wagePerHour, setWagePerHour] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [managerName, setManagerName] = useState("");
  const [bsb, setBsb] = useState(""); // New state for BSB
  const [accountNumber, setAccountNumber] = useState(""); // New state for account number
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    router.push("/login");
    return null;
  }

  const validateForm = () => {
    if (!role) return "Please select a role.";
    if (!wagePerHour || isNaN(parseFloat(wagePerHour)) || parseFloat(wagePerHour) <= 0) {
      return "Wage per hour must be a positive number.";
    }
    if (!contactNumber || !/^\d{10}$/.test(contactNumber)) {
      return "Contact number must be a 10-digit number.";
    }
    if (!managerName || managerName.trim().length === 0) {
      return "Manager's name cannot be empty.";
    }
    if (!bsb || !/^\d{6}$/.test(bsb)) {
      return "BSB must be a 6-digit number.";
    }
    if (!accountNumber || !/^\d{6,9}$/.test(accountNumber)) {
      return "Account number must be between 6 and 9 digits.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await axios.patch(`/api/users/${session.user.id}`, {
        role,
        wagePerHour: parseFloat(wagePerHour),
        contactNumber,
        managerName,
        bsb, // Include BSB in the update
        accountNumber, // Include account number in the update
      });
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
        <p className="mb-4">Please provide your details:</p>
        <Select onValueChange={setRole} value={role}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EMPLOYEE">Employee</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Wage per hour (e.g., 80)"
          value={wagePerHour}
          onChange={(e) => setWagePerHour(e.target.value)}
          className="mt-4"
          min="0"
          step="0.01"
        />
        <Input
          type="text"
          placeholder="Contact number (e.g., 0416500319)"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ""))} // Only allow digits
          className="mt-4"
          maxLength={10}
        />
        <Input
          type="text"
          placeholder="Manager's name"
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
          className="mt-4"
        />
        <Input
          type="text"
          placeholder="BSB (e.g., 062443)"
          value={bsb}
          onChange={(e) => setBsb(e.target.value.replace(/\D/g, ""))} // Only allow digits
          className="mt-4"
          maxLength={6}
        />
        <Input
          type="text"
          placeholder="Account number (e.g., 11467258)"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))} // Only allow digits
          className="mt-4"
          maxLength={9}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <Button onClick={handleSubmit} className="mt-6 w-full" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}