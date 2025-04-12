
import React from 'react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  LineChart,
  Line 
} from 'recharts';

// Helper function to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const Progress = () => {
  const { workouts } = useWorkout();

  // Get workouts for the past 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentWorkouts = workouts.filter(workout => 
    workout.date >= thirtyDaysAgo && workout.isCompleted
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  // Prepare data for the workouts per week chart
  const workoutsPerWeek = recentWorkouts.reduce<Record<string, number>>((acc, workout) => {
    const weekOfYear = getWeekOfYear(workout.date);
    const key = `Week ${weekOfYear}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const workoutsPerWeekData = Object.keys(workoutsPerWeek).map(week => ({
    week,
    count: workoutsPerWeek[week]
  }));

  // Prepare data for the exercises per workout chart
  const exercisesPerWorkoutData = recentWorkouts.map(workout => ({
    date: formatDate(workout.date),
    count: workout.exercises.length
  }));

  // Find the most common exercises
  const exerciseCounts: Record<string, number> = {};
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;
    });
  });

  const sortedExercises = Object.entries(exerciseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Progress</h1>
          <p className="text-muted-foreground">Track your fitness journey over time</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workouts Per Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {workoutsPerWeekData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workoutsPerWeekData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" name="Workouts" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Not enough data to display</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exercises Per Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {exercisesPerWorkoutData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={exercisesPerWorkoutData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" name="Exercises" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Not enough data to display</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most Common Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedExercises.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={sortedExercises.map(([name, count]) => ({ name, count }))}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" name="Times Performed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">No exercise data available yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get the week number of a date
function getWeekOfYear(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export default Progress;
