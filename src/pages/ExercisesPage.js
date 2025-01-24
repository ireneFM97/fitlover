import React, { useState, useEffect, useRef } from 'react';
import '../assets/styles/ExercisesPage.css';
import ExerciseCard from '../components/ExerciseCard';
import exerciseData from '../assets/exercises/exerciseData';
import Breadcrumb from '../components/Breadcrumb';

function ExercisesPage({ routine, addToRoutine, removeFromRoutine }) {
  const [selectedBodyPart, setSelectedBodyPart] = useState('Todos'); // Filtro por parte del cuerpo
  const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para controlar el desplegable

  const dropdownRef = useRef(null); // Referencia al contenedor del desplegable

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Cierra el menú si el clic es fuera del contenedor
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Limpia el evento al desmontar
    };
  }, []);

  // Filtrar ejercicios según el botón seleccionado
  const filteredExercises =
    selectedBodyPart === 'Todos'
      ? exerciseData
      : exerciseData.filter(exercise => exercise.bodyPart.includes(selectedBodyPart));

  const bodyParts = ['Todos', 'Pierna', 'Espalda', 'CORE', 'Pecho', 'Hombros', 'Biceps', 'Triceps', 'Cardio'];

  const paths = [
    { name: 'Home', link: '/' },
    { name: 'Ejercicios', link: '/ejercicios' }
  ];

  return (
    <div className="ExercisesPage">
      {/* Breadcrumb */}
      <Breadcrumb paths={paths} />

      <h1>Listado de Ejercicios</h1>
      {/* Filtro desplegable */}
      <div className="filter-container" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="btn"
        >
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v2.172a2 2 0 0 1-.586 1.414L15 12v7l-6 2v-8.5L4.52 7.572A2 2 0 0 1 4 6.227z"/>
            </svg>
          </span>
          <span className="text">
            {selectedBodyPart === 'Todos' ? 'Filtrar' : selectedBodyPart}
          </span>
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            {bodyParts.map(part => (
              <button
                key={part}
                onClick={() => {
                  setSelectedBodyPart(part);
                  setDropdownOpen(false); // Cerrar desplegable al seleccionar
                }}
                className={`dropdown-item ${selectedBodyPart === part ? 'selected' : ''}`}
              >
                {part === 'Todos' ? 'Todos' : part.charAt(0).toUpperCase() + part.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lista de ejercicios filtrados */}
      <div className="exercise-list">
        {filteredExercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            routine={routine}
            addToRoutine={addToRoutine}
            removeFromRoutine={removeFromRoutine}
          />
        ))}
      </div>
    </div>
  );
}

export default ExercisesPage;
