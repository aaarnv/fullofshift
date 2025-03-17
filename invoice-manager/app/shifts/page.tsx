"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, isPast } from "date-fns";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, GraduationCap, School, Repeat, Info, Trash2, CheckCircle, Plus } from "lucide-react";
import { Status } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { NewShift } from "@/app/shifts/new/NewShift";
import NavBar from "@/app/components/NavBar";

interface Shift {
  id: number;
  class: string;
  grade: string;
  status: Status;
  date: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
}

const ShiftView = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [isConfirmAllLoading, setIsConfirmAllLoading] = useState(false);

  const fetchShifts = async () => {
    try {
      const response = await axios.get("/api/shifts");

      const updatedShifts = await Promise.all(
        response.data.map(async (shift: Shift) => {
          const shiftDate = shift.date.split("T")[0];
          const shiftDateTime = new Date(`${shiftDate}T${shift.endTime}`);

          if (shift.status === "UPCOMING" && isPast(shiftDateTime)) {
            try {
              const updateResponse = await axios.patch(`/api/shifts/${shift.id}`, {
                status: "PENDING",
              });
              console.log(`Updated shift ${shift.id} to PENDING:`, updateResponse.data);
              return { ...shift, status: "PENDING" };
            } catch (err) {
              console.error(`Failed to update shift ${shift.id}:`, err);
              return shift;
            }
          }
          return shift;
        })
      );

      setShifts(updatedShifts);
      setError("");
    } catch (err) {
      setError("Error loading shifts");
      console.error("Error fetching shifts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
    const intervalId = setInterval(fetchShifts, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  const handleShiftCreated = async () => {
    setIsDialogOpen(false);
    await fetchShifts();
  };

  const handleDeleteShift = async (shiftId: number) => {
    try {
      await axios.delete(`/api/shifts/${shiftId}`);
      await fetchShifts();
      setDeleteError("");
    } catch (err) {
      setDeleteError("Failed to delete shift");
      console.error("Error deleting shift:", err);
    }
  };

  const handleLogShift = async (shiftId: number) => {
    try {
      await axios.patch(`/api/shifts/${shiftId}`, { status: "LOGGED" });
      setUpdateSuccess("Shift completed successfully!");
      await fetchShifts();
    } catch (err) {
      setError("Failed to update shift status");
      console.error("Error updating shift status:", err);
    }
  };

  const handleConfirmAll = async () => {
    if (pendingShifts.length === 0) return;

    setIsConfirmAllLoading(true);
    setError("");
    try {
      await Promise.all(
        pendingShifts.map(async (shift) => {
          await axios.patch(`/api/shifts/${shift.id}`, { status: "LOGGED" });
        })
      );
      setUpdateSuccess("All pending shifts confirmed successfully!");
      await fetchShifts();
    } catch (err) {
      setError("Failed to confirm all shifts. Please try again.");
      console.error("Error confirming all shifts:", err);
    } finally {
      setIsConfirmAllLoading(false);
    }
  };

  const getStatusBadgeStyle = (status: Status) => {
    const styles = {
      UPCOMING: "bg-blue-100 text-blue-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      LOGGED: "bg-green-100 text-green-800",
      REQUESTED: "bg-orange-100 text-orange-800",
      PAID: "bg-purple-100 text-purple-800",
    };
    return styles[status];
  };

  const loggedShifts = shifts.filter((shift) => shift.status === "LOGGED");
  const pendingShifts = shifts.filter((shift) => shift.status === "PENDING");
  const upcomingShifts = shifts.filter((shift) => shift.status === "UPCOMING");

  if (loading) {
    return <div className="flex justify-center items-center h-48">Loading shifts...</div>;
  }

  const renderShiftCard = (shift: Shift, showConfirmButton = false) => (
    <Card key={shift.id} className="hover:shadow-lg transition-shadow mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <School className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold">{shift.class}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusBadgeStyle(shift.status)}>{shift.status}</Badge>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Shift</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this shift? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteShift(shift.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <GraduationCap className="h-4 w-4 text-gray-500" />
          <span>Grade {shift.grade}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{format(new Date(shift.date), "MMM dd, yyyy")}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>
            {shift.startTime} - {shift.endTime}
          </span>
        </div>
        {shift.recurring && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Repeat className="h-4 w-4" />
            <span>Recurring Shift</span>
          </div>
        )}

        {showConfirmButton && (
          <Button
            className="w-full mt-2 bg-green-500 hover:bg-green-600"
            onClick={() => handleLogShift(shift.id)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm Completion
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <NavBar />

      <div className="p-6 space-y-6">
        {(error || deleteError) && (
          <Alert variant="destructive">
            <Info className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || deleteError}</AlertDescription>
          </Alert>
        )}

        {updateSuccess && (
          <Alert variant="default">
            <CheckCircle className="h-5 w-5" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{updateSuccess}</AlertDescription>
          </Alert>
        )}

        {shifts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No shifts found. Create your first shift to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {/* LOGGED shifts column */}
            <div className="col-span-12 md:col-span-3 lg:col-span-3">
              <div className="p-4 rounded-lg bg-black">
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Logged Shifts ({loggedShifts.length})
                </h2>
                <div className="overflow-y-auto max-h-[70vh]">
                  {loggedShifts.length === 0 ? (
                    <p className="text-gray-500 text-center text-sm">No logged shifts</p>
                  ) : (
                    loggedShifts.map((shift) => renderShiftCard(shift))
                  )}
                </div>
              </div>
            </div>

            {/* PENDING shifts column (slightly wider) */}
            <div className="col-span-12 md:col-span-6 lg:col-span-6 relative">
              <div className="p-4 rounded-lg bg-black">
                <h2 className="text-lg font-semibold mb-4 text-center">
                  To Confirm ({pendingShifts.length})
                </h2>
                <div className="overflow-y-auto max-h-[70vh]">
                  {pendingShifts.length === 0 ? (
                    <p className="text-gray-500 text-center text-sm">No pending shifts</p>
                  ) : (
                    pendingShifts.map((shift) => renderShiftCard(shift, true))
                  )}
                </div>
              </div>
              {/* Overlay Confirm All Button */}
              {pendingShifts.length > 0 && (
                <Button
                  onClick={handleConfirmAll}
                  className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black border-2 border-green-800 hover:bg-green-900 text-white rounded-full w-12 h-12 flex items-center justify-center"
                  disabled={isConfirmAllLoading}
                  aria-label="Confirm All Shifts"
                >
                  {isConfirmAllLoading ? (
                    "Confirming..."
                  ) : (
                    <CheckCircle className="h-6 w-6" />
                  )}
                </Button>
              )}
            </div>

            {/* UPCOMING shifts column */}
            <div className="col-span-12 md:col-span-3 lg:col-span-3">
              <div className="p-4 rounded-lg bg-black">
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Upcoming Shifts ({upcomingShifts.length})
                </h2>
                <div className="overflow-y-auto max-h-[70vh]">
                  {upcomingShifts.length === 0 ? (
                    <p className="text-gray-500 text-center text-sm">No upcoming shifts</p>
                  ) : (
                    upcomingShifts.map((shift) => renderShiftCard(shift))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 bg-gray-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="New Shift"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Shift</DialogTitle>
            </DialogHeader>
            <NewShift onSuccess={handleShiftCreated} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ShiftView;