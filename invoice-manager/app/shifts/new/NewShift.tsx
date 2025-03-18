// app/shifts/new/NewShift.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createShiftSchema } from "@/app/validationSchemas";
import { z } from "zod";
import { useRouter } from "next/navigation";

type ShiftForm = z.infer<typeof createShiftSchema>;

interface NewShiftProps {
  onSuccess?: () => void;
}

export const NewShift = ({ onSuccess }: NewShiftProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ShiftForm>({
    resolver: zodResolver(createShiftSchema),
    defaultValues: {
      recurring: false,
      status: "UPCOMING",
    },
  });
  const [error, setError] = useState("");

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/shifts"); // Default navigation if no onSuccess prop
    }
  };

  return (
    <div className="space-y-4 p-4">
      {error && (
        <Alert variant="destructive">
          <Info className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (data) => {
          try {
            await axios.post("/api/shifts", data);
            handleSuccess();
          } catch (error) {
            setError("An unexpected error occurred while creating the shift.");
            console.error(error);
          }
        })}
      >
        <div className="space-y-2">
          <Input
            id="class"
            placeholder="Shift Title"
            {...register("class")}
            className={errors.class ? "border-red-500" : ""}
          />
          {errors.class && (
            <span className="text-sm text-red-500">{errors.class.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Input
            id="grade"
            placeholder="Shift Description"
            {...register("grade")}
            className={errors.grade ? "border-red-500" : ""}
          />
          {errors.grade && (
            <span className="text-sm text-red-500">{errors.grade.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Select
            onValueChange={(value) => setValue("status", value as ShiftForm["status"])}
            defaultValue="UPCOMING"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UPCOMING">Upcoming</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="LOGGED">Logged</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <span className="text-sm text-red-500">{errors.status.message}</span>
          )}
        </div>

        <div className="flex space-x-2">
          <div className="flex-1 space-y-2">
            <label htmlFor="date" className="text-sm font-medium text-gray-700 ml-1">
              Date
            </label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <span className="text-sm text-red-500 block">{errors.date.message}</span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <label htmlFor="startTime" className="text-sm font-medium text-gray-700 ml-1">
              Start
            </label>
            <Input
              id="startTime"
              type="time"
              {...register("startTime")}
              className={errors.startTime ? "border-red-500" : ""}
            />
            {errors.startTime && (
              <span className="text-sm text-red-500 block">{errors.startTime.message}</span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <label htmlFor="endTime" className="text-sm font-medium text-gray-700 ml-1">
              End
            </label>
            <Input
              id="endTime"
              type="time"
              {...register("endTime")}
              className={errors.endTime ? "border-red-500" : ""}
            />
            {errors.endTime && (
              <span className="text-sm text-red-500 block">{errors.endTime.message}</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="recurring"
            onCheckedChange={(checked) => setValue("recurring", checked as boolean)}
          />
          <label htmlFor="recurring" className="text-sm font-medium leading-none">
            Recurring Shift
          </label>
        </div>

        <Button type="submit" className="w-full">Create Shift</Button>
      </form>
    </div>
  );
};