
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkout } from '@/contexts/WorkoutContext';
import { format } from 'date-fns';
import WorkoutSummaryCard from '@/components/workout/WorkoutSummaryCard';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { workouts } = useWorkout();

  // Get all the dates that have workouts
  const workoutDates = workouts.map(workout => {
    const date = new Date(workout.date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
  });

  // Function to highlight dates with workouts
  const isDayWithWorkout = (day: Date) => {
    const dateString = new Date(day.getFullYear(), day.getMonth(), day.getDate()).toISOString();
    return workoutDates.includes(dateString);
  };

  // Get workouts for the selected date
  const selectedDateWorkouts = workouts.filter(workout => {
    if (!selectedDate) return false;
    
    const workoutDate = new Date(workout.date);
    return (
      workoutDate.getFullYear() === selectedDate.getFullYear() &&
      workoutDate.getMonth() === selectedDate.getMonth() &&
      workoutDate.getDate() === selectedDate.getDate()
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View your workout history</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                workout: (date) => isDayWithWorkout(date)
              }}
              modifiersClassNames={{
                workout: "bg-primary/20 font-bold text-primary"
              }}
            />
          </CardContent>
        </Card>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? (
                  `Workouts for ${format(selectedDate, 'MMMM d, yyyy')}`
                ) : (
                  'Select a date to view workouts'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateWorkouts.map(workout => (
                    <WorkoutSummaryCard key={workout.id} workout={workout} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    {selectedDate ? 'No workouts on this date' : 'Select a date to view workouts'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
