
import React, { useState } from 'react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save, CheckCircle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import ExerciseCard from '@/components/workout/ExerciseCard';
import { useNavigate } from 'react-router-dom';
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

const Workouts = () => {
  const { currentWorkout, startNewWorkout, addExerciseToWorkout, completeWorkout, deleteWorkout } = useWorkout();
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [isNewWorkoutDialogOpen, setIsNewWorkoutDialogOpen] = useState(false);
  const [isNewExerciseDialogOpen, setIsNewExerciseDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartNewWorkout = () => {
    if (newWorkoutName.trim()) {
      startNewWorkout(newWorkoutName.trim());
      setNewWorkoutName('');
      setIsNewWorkoutDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Please enter a workout name",
        variant: "destructive"
      });
    }
  };

  const handleAddExercise = () => {
    if (currentWorkout && newExerciseName.trim()) {
      addExerciseToWorkout(currentWorkout.id, newExerciseName.trim());
      setNewExerciseName('');
      setIsNewExerciseDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Please enter an exercise name",
        variant: "destructive"
      });
    }
  };

  const handleCompleteWorkout = () => {
    if (currentWorkout) {
      completeWorkout(currentWorkout.id);
      navigate('/');
    }
  };

  const handleDeleteWorkout = () => {
    if (currentWorkout) {
      deleteWorkout(currentWorkout.id);
      navigate('/');
    }
  };

  if (!currentWorkout) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Workouts</h1>
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">No Active Workout</h2>
              <p className="text-muted-foreground">Start a new workout to begin tracking your exercises and sets.</p>
              <Button onClick={() => setIsNewWorkoutDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Start New Workout
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isNewWorkoutDialogOpen} onOpenChange={setIsNewWorkoutDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a New Workout</DialogTitle>
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
              <Button onClick={handleStartNewWorkout}>Start Workout</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{currentWorkout.name}</h1>
        <div className="flex space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Workout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this workout? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteWorkout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button size="sm" onClick={handleCompleteWorkout}>
            <CheckCircle className="h-4 w-4 mr-2" /> Complete
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {currentWorkout.exercises.length > 0 ? (
          currentWorkout.exercises.map((exercise) => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              workoutId={currentWorkout.id} 
            />
          ))
        ) : (
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-muted-foreground">No exercises added yet.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button 
          variant="outline" 
          className="w-full mt-4" 
          onClick={() => setIsNewExerciseDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Exercise
        </Button>
      </div>

      <Dialog open={isNewExerciseDialogOpen} onOpenChange={setIsNewExerciseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <Input 
                id="exercise-name" 
                placeholder="e.g., Bench Press" 
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddExercise}>Add Exercise</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workouts;
