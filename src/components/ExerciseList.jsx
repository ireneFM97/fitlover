import React from 'react';
import ExerciseCard from './ExerciseCard';

function ExerciseList({ exercises, addToRoutine }) {
  return (
    <div>
      {exercises.map(exercise => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          addToRoutine={addToRoutine} // Pasamos la función aquí
        />
      ))}
    </div>
  );
}

export default ExerciseList;