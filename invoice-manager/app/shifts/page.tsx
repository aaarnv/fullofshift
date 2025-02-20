"use client";
import React from 'react';
import { format, addDays, isPast } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Plus } from 'lucide-react';

interface Shift {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isCompleted?: boolean;
  isDenied?: boolean;
}

export default function ShiftManagementPage() {
  const [shifts, setShifts] = React.useState<Shift[]>([]);
  const [newShift, setNewShift] = React.useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  const handleAddShift = () => {
    const shift: Shift = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(newShift.date),
      startTime: newShift.startTime,
      endTime: newShift.endTime
    };
    setShifts([...shifts, shift]);
    setNewShift({ date: '', startTime: '', endTime: '' });
  };

  const handleShiftStatus = (id: string, status: 'completed' | 'denied') => {
    setShifts(shifts.map(shift => {
      if (shift.id === id) {
        return {
          ...shift,
          isCompleted: status === 'completed',
          isDenied: status === 'denied'
        };
      }
      return shift;
    }));
  };

  const upcomingShifts = shifts.filter(shift => !isPast(shift.date));
  const pastShifts = shifts.filter(shift => isPast(shift.date));

  return (
    <div className="flex h-screen">
      {/* Left Side - Upcoming Shifts */}
      <div className="w-1/2 flex flex-col gap-4">
        <Card className="p-4">
          <h2 className="text-lg font-bold mb-4">Schedule New Shift</h2>
          <div className="flex flex-col gap-2">
            <Input
              type="date"
              value={newShift.date}
              onChange={(e) => setNewShift({...newShift, date: e.target.value})}
              placeholder="Date"
            />
            <Input
              type="time"
              value={newShift.startTime}
              onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
              placeholder="Start Time"
            />
            <Input
              type="time"
              value={newShift.endTime}
              onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
              placeholder="End Time"
            />
            <Button onClick={handleAddShift} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Shift
            </Button>
          </div>
        </Card>
        
        <div className="flex-1 overflow-y-auto">
          {upcomingShifts.map(shift => (
            <Card key={shift.id} className="mb-2">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{format(shift.date, 'PPP')}</p>
                    <p>{`${shift.startTime} - ${shift.endTime}`}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Side - Past Shifts */}
      <div className="w-1/2 overflow-y-auto">
        {pastShifts.map(shift => (
          <Card key={shift.id} className="mb-2">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <XCircle
                  className={`h-6 w-6 cursor-pointer ${
                    shift.isDenied ? 'text-red-500' : 'text-gray-300'
                  }`}
                  onClick={() => handleShiftStatus(shift.id, 'denied')}
                />
                <div>
                  <p className="font-bold">{format(shift.date, 'PPP')}</p>
                  <p>{`${shift.startTime} - ${shift.endTime}`}</p>
                </div>
                <CheckCircle
                  className={`h-6 w-6 cursor-pointer ${
                    shift.isCompleted ? 'text-green-500' : 'text-gray-300'
                  }`}
                  onClick={() => handleShiftStatus(shift.id, 'completed')}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}