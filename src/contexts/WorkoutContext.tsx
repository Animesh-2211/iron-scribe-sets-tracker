
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Workout, Exercise, Set } from '@/types/workout';
import { toast } from "@/components/ui/use-toast";

interface WorkoutContextType {
  workouts: Workout[];
  currentWorkout: Workout | null;
  startNewWorkout: (name: string) => void;
  addExerciseToWorkout: (workoutId: string, exerciseName: string) => void;
  addSetToExercise: (workoutId: string, exerciseId: string) => void;
  updateSet: (workoutId: string, exerciseId: string, setId: string, data: Partial<Set>) => void;
  completeWorkout: (workoutId: string) => void;
  deleteWorkout: (workoutId: string) => void;
  getWorkout: (workoutId: string) => Workout | undefined;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

const LOCAL_STORAGE_KEY = 'gym-logger-workouts';

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);

  // Load workouts from localStorage on initial render
  useEffect(() => {
    const savedWorkouts = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedWorkouts) {
      try {
        const parsedWorkouts = JSON.parse(savedWorkouts);
        // Convert ISO date strings back to Date objects
        const workoutsWithDateObjects = parsedWorkouts.map((workout: any) => ({
          ...workout,
          date: new Date(workout.date)
        }));
        setWorkouts(workoutsWithDateObjects);
      } catch (error) {
        console.error('Failed to parse workouts from localStorage', error);
        toast({
          title: "Error",
          description: "Failed to load your saved workouts",
          variant: "destructive"
        });
      }
    }
  }, []);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(workouts));
  }, [workouts]);

  const startNewWorkout = (name: string) => {
    const newWorkout: Workout = {
      id: uuidv4(),
      name,
      date: new Date(),
      exercises: [],
      isCompleted: false
    };
    
    setWorkouts(prev => [...prev, newWorkout]);
    setCurrentWorkout(newWorkout);
    toast({
      title: "Workout Started",
      description: `${name} workout has been started!`
    });
  };

  const addExerciseToWorkout = (workoutId: string, exerciseName: string) => {
    const newExercise: Exercise = {
      id: uuidv4(),
      name: exerciseName,
      sets: [
        {
          id: uuidv4(),
          weight: 0,
          reps: 0,
          isCompleted: false
        }
      ]
    };

    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === workoutId 
          ? { ...workout, exercises: [...workout.exercises, newExercise] }
          : workout
      )
    );

    // Also update currentWorkout if this is the active one
    if (currentWorkout?.id === workoutId) {
      setCurrentWorkout({
        ...currentWorkout,
        exercises: [...currentWorkout.exercises, newExercise]
      });
    }
  };

  const addSetToExercise = (workoutId: string, exerciseId: string) => {
    const newSet: Set = {
      id: uuidv4(),
      weight: 0,
      reps: 0,
      isCompleted: false
    };

    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === workoutId 
          ? {
              ...workout,
              exercises: workout.exercises.map(exercise => 
                exercise.id === exerciseId
                  ? { ...exercise, sets: [...exercise.sets, newSet] }
                  : exercise
              )
            }
          : workout
      )
    );

    // Also update currentWorkout if this is the active one
    if (currentWorkout?.id === workoutId) {
      setCurrentWorkout({
        ...currentWorkout,
        exercises: currentWorkout.exercises.map(exercise => 
          exercise.id === exerciseId
            ? { ...exercise, sets: [...exercise.sets, newSet] }
            : exercise
        )
      });
    }
  };

  const updateSet = (workoutId: string, exerciseId: string, setId: string, data: Partial<Set>) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === workoutId 
          ? {
              ...workout,
              exercises: workout.exercises.map(exercise => 
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      sets: exercise.sets.map(set => 
                        set.id === setId
                          ? { ...set, ...data }
                          : set
                      )
                    }
                  : exercise
              )
            }
          : workout
      )
    );

    // Also update currentWorkout if this is the active one
    if (currentWorkout?.id === workoutId) {
      setCurrentWorkout({
        ...currentWorkout,
        exercises: currentWorkout.exercises.map(exercise => 
          exercise.id === exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map(set => 
                  set.id === setId
                    ? { ...set, ...data }
                    : set
                )
              }
            : exercise
        )
      });
    }
  };

  const completeWorkout = (workoutId: string) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === workoutId 
          ? { ...workout, isCompleted: true }
          : workout
      )
    );

    if (currentWorkout?.id === workoutId) {
      setCurrentWorkout(null);
    }
    
    toast({
      title: "Workout Completed",
      description: "Great job! Your workout has been saved."
    });
  };

  const deleteWorkout = (workoutId: string) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
    
    if (currentWorkout?.id === workoutId) {
      setCurrentWorkout(null);
    }
    
    toast({
      title: "Workout Deleted",
      description: "The workout has been deleted"
    });
  };

  const getWorkout = (workoutId: string) => {
    return workouts.find(workout => workout.id === workoutId);
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        currentWorkout,
        startNewWorkout,
        addExerciseToWorkout,
        addSetToExercise,
        updateSet,
        completeWorkout,
        deleteWorkout,
        getWorkout
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
