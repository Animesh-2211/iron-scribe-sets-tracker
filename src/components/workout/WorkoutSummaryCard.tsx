
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Calendar, CheckCircle } from 'lucide-react';
import { Workout } from '@/types/workout';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface WorkoutSummaryCardProps {
  workout: Workout;
}

const WorkoutSummaryCard: React.FC<WorkoutSummaryCardProps> = ({ workout }) => {
  const navigate = useNavigate();
  
  const totalSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.length, 
    0
  );
  
  const completedSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter(set => set.isCompleted).length, 
    0
  );

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">{workout.name}</h3>
              {workout.isCompleted && (
                <Badge variant="outline" className="border-green-500 text-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" /> Completed
                </Badge>
              )}
            </div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(new Date(workout.date), 'MMMM d, yyyy')}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            <span>{workout.exercises.length} exercises</span>
          </div>
          
          <div className="flex items-center gap-2">
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
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button variant="outline" size="sm" onClick={() => navigate(`/workouts/${workout.id}`)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutSummaryCard;
