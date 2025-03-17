// script.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addRecurringShifts() {
  const recurringShifts = await prisma.shift.findMany({
    where: { recurring: true },
  });

  for (const shift of recurringShifts) {
    const originalDate = new Date(shift.date);
    const newDate = new Date(originalDate);
    newDate.setMonth(newDate.getMonth() + 1);

    const newDateString = newDate.toISOString().split('T')[0];

    const existingShift = await prisma.shift.findFirst({
      where: {
        date: newDateString,
        startTime: shift.startTime,
        endTime: shift.endTime,
        class: shift.class,
        grade: shift.grade,
      },
    });

    if (!existingShift) {
      await prisma.shift.create({
        data: {
          class: shift.class,
          grade: shift.grade,
          status: 'UPCOMING', 
          date: newDateString,
          startTime: shift.startTime,
          endTime: shift.endTime,
          recurring: true, 
        },
      });
      console.log(`Created shift for ${newDateString}`);
    } else {
      console.log(`Shift already exists for ${newDateString}`);
    }
  }
}

// Determine if today is the last day of the month
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

// If the month changes tomorrow, today is the last day
if (today.getMonth() !== tomorrow.getMonth()) {
  console.log('Executing shift addition for next month...');
  addRecurringShifts()
    .catch((error) => console.error('Error:', error))
    .finally(() => prisma.$disconnect());
} else {
  console.log('Not the last day of the month. No action taken.');
  prisma.$disconnect();
}