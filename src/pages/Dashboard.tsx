
import React from 'react';
import { Plus, Calendar, BarChart2, Dumbbell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkout } from '@/contexts/WorkoutContext';
import { useNavigate } from 'react-router-dom';
import WorkoutSummaryCard from '@/components/workout/WorkoutSummaryCard';

const Dashboard: React.FC = () => {
  const [newWorkoutName, setNewWorkoutName] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { workouts, startNewWorkout, currentWorkout } = useWorkout();
  const navigate = useNavigate();

  const handleStartWorkout = () => {
    if (newWorkoutName.trim()) {
      startNewWorkout(newWorkoutName.trim());
      setNewWorkoutName('');
      setDialogOpen(false);
      navigate('/workouts');
    }
  };

  const recentWorkouts = [...workouts]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3);

  const totalWorkouts = workouts.length;
  const completedWorkouts = workouts.filter(w => w.isCompleted).length;
  const totalExercises = workouts.reduce((total, workout) => total + workout.exercises.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and start a new workout</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0" size="sm">
              <Plus className="mr-2 h-4 w-4" /> New Workout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a New Workout</DialogTitle>
              <DialogDescription>
                Give your workout a name to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input 
                  id="workout-name" 
                  placeholder="e.g., Chest & Triceps" 
                  value={newWorkoutName}
                  onChange={(e) => setNewWorkoutName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleStartWorkout}>Start Workout</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {currentWorkout && (
        <div className="mb-6">
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Current Workout</CardTitle>
              <CardDescription>Continue where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{currentWorkout.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentWorkout.exercises.length} exercises
                  </p>
                </div>
                <Button onClick={() => navigate('/workouts')}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-4 w-4 text-primary" />
              <CardTitle className="text-lg">Total Workouts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              {completedWorkouts} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <CardTitle className="text-lg">Workouts This Week</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {workouts.filter(w => {
                const now = new Date();
                const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                startOfWeek.setHours(0, 0, 0, 0);
                return w.date >= startOfWeek;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Keep up the good work!
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-4 w-4 text-primary" />
              <CardTitle className="text-lg">Total Exercises</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalExercises}</div>
            <p className="text-xs text-muted-foreground">
              Across all workouts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
        {recentWorkouts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentWorkouts.map(workout => (
              <WorkoutSummaryCard key={workout.id} workout={workout} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-muted-foreground">No workouts yet. Start your fitness journey today!</p>
                <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> New Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
