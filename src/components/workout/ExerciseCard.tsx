
import React, { useState } from 'react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Check } from 'lucide-react';
import { Exercise, Set } from '@/types/workout';

interface ExerciseCardProps {
  exercise: Exercise;
  workoutId: string;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, workoutId }) => {
  const { addSetToExercise, updateSet } = useWorkout();
  
  const handleAddSet = () => {
    addSetToExercise(workoutId, exercise.id);
  };
  
  const handleUpdateSetWeight = (setId: string, weight: number) => {
    updateSet(workoutId, exercise.id, setId, { weight });
  };
  
  const handleUpdateSetReps = (setId: string, reps: number) => {
    updateSet(workoutId, exercise.id, setId, { reps });
  };
  
  const handleToggleSetCompletion = (setId: string, isCompleted: boolean) => {
    updateSet(workoutId, exercise.id, setId, { isCompleted });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{exercise.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm text-muted-foreground">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Weight</div>
            <div className="col-span-4">Reps</div>
            <div className="col-span-3">Done</div>
          </div>
          
          {exercise.sets.map((set, index) => (
            <SetRow 
              key={set.id}
              set={set}
              setNumber={index + 1}
              onUpdateWeight={(weight) => handleUpdateSetWeight(set.id, weight)}
              onUpdateReps={(reps) => handleUpdateSetReps(set.id, reps)}
              onToggleCompletion={(isCompleted) => handleToggleSetCompletion(set.id, isCompleted)}
            />
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2" 
            onClick={handleAddSet}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface SetRowProps {
  set: Set;
  setNumber: number;
  onUpdateWeight: (weight: number) => void;
  onUpdateReps: (reps: number) => void;
  onToggleCompletion: (isCompleted: boolean) => void;
}

const SetRow: React.FC<SetRowProps> = ({ 
  set, 
  setNumber, 
  onUpdateWeight, 
  onUpdateReps, 
  onToggleCompletion 
}) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-1 font-medium">{setNumber}</div>
      <div className="col-span-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-r-none"
            onClick={() => onUpdateWeight(Math.max(0, set.weight - 2.5))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={set.weight}
            onChange={(e) => onUpdateWeight(parseFloat(e.target.value) || 0)}
            className="h-8 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-l-none"
            onClick={() => onUpdateWeight(set.weight + 2.5)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="col-span-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-r-none"
            onClick={() => onUpdateReps(Math.max(0, set.reps - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={set.reps}
            onChange={(e) => onUpdateReps(parseInt(e.target.value) || 0)}
            className="h-8 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-l-none"
            onClick={() => onUpdateReps(set.reps + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="col-span-3">
        <Button 
          variant={set.isCompleted ? "default" : "outline"} 
          size="sm" 
          className={`w-full ${set.isCompleted ? 'bg-gym-green hover:bg-gym-green/90' : ''}`}
          onClick={() => onToggleCompletion(!set.isCompleted)}
        >
          {set.isCompleted && <Check className="h-4 w-4 mr-1" />}
          {set.isCompleted ? 'Done' : 'Mark'}
        </Button>
      </div>
    </div>
  );
};

export default ExerciseCard;
