
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, CheckCircle, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';
import ExerciseCard from '@/components/workout/ExerciseCard';
import { Badge } from '@/components/ui/badge';

const WorkoutDetail = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const { getWorkout } = useWorkout();
  const navigate = useNavigate();
  
  const workout = getWorkout(workoutId!);
  
  if (!workout) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Card>
          <CardContent className="py-6">
            <div className="text-center">
              <p className="text-muted-foreground">Workout not found</p>
              <Button className="mt-4" onClick={() => navigate('/workouts')}>
                Go to Workouts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const totalSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.length, 
    0
  );
  
  const completedSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter(set => set.isCompleted).length, 
    0
  );

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{workout.name}</h1>
            {workout.isCompleted && (
              <Badge variant="outline" className="border-green-500 text-green-500">
                <CheckCircle className="h-3 w-3 mr-1" /> Completed
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-2 text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(new Date(workout.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{format(new Date(workout.date), 'h:mm a')}</span>
            </div>
            <div className="flex items-center">
              <Dumbbell className="h-4 w-4 mr-1" />
              <span>{workout.exercises.length} exercises</span>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Progress:</span>
            <span className="text-sm">{completedSets}/{totalSets} sets completed</span>
            <div className="flex-grow h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gym-green rounded-full" 
                style={{ 
                  width: totalSets > 0 ? `${(completedSets / totalSets) * 100}%` : '0%'
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {workout.exercises.map((exercise) => (
          <ExerciseCard 
            key={exercise.id} 
            exercise={exercise} 
            workoutId={workout.id} 
          />
        ))}
      </div>
    </div>
  );
};

export default WorkoutDetail;
