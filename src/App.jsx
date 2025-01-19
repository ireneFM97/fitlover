import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExercisesPage from './pages/ExercisesPage';
import RoutinePage from './pages/RoutinePage';
import DayRoutinePage from './pages/DayRoutinePage';
import Navbar from './components/Navbar';
import Loading from './components/Loading';

function App() {
  // Función para cargar la rutina desde localStorage
  const loadRoutineFromLocalStorage = () => {
    const savedRoutine = localStorage.getItem('routine');
    return savedRoutine
      ? JSON.parse(savedRoutine)
      : {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
        };
  };

  // Estado para manejar la rutina
  const [routine, setRoutine] = useState(loadRoutineFromLocalStorage);

  // Estado de carga para simular un proceso de carga
  const [loading, setLoading] = useState(true);

  // Simulación de carga de los datos de rutina
  useEffect(() => {
    // Simulamos un retraso en la carga de los datos (por ejemplo, para cargar desde localStorage)
    setTimeout(() => {
      setLoading(false); // Finalizamos el loading después de un retraso
    }, 1000); // Aquí puedes ajustar el tiempo de espera según sea necesario
  }, []);

  // Guardar rutina en localStorage cada vez que cambie el estado de la rutina
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('routine', JSON.stringify(routine));
    }
  }, [routine, loading]);

  // Funciones para agregar y eliminar ejercicios en la rutina
  const addToRoutine = (day, exercise) => {
    setRoutine((prevRoutine) => {
      const updatedRoutine = { ...prevRoutine };
      if (!updatedRoutine[day].some((ex) => ex.id === exercise.id)) {
        updatedRoutine[day].push(exercise);
      }
      return updatedRoutine;
    });
  };

  const removeFromRoutine = (day, exerciseId) => {
    setRoutine((prevRoutine) => {
      const updatedRoutine = { ...prevRoutine };

      // Verificar que updatedRoutine[day] existe y es un array
      if (Array.isArray(updatedRoutine[day])) {
        updatedRoutine[day] = updatedRoutine[day].filter((ex) => ex.id !== exerciseId);
      } else {
        console.warn(`No routine found for day: ${day}`);
      }

      return updatedRoutine;
    });
  };

  // Mostrar el componente Loading si estamos en la fase de carga
  if (loading) {
    return <Loading />;
  }

  // Renderizar la aplicación después de la carga
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="ejercicios"
            element={
              <ExercisesPage
                routine={routine}
                addToRoutine={addToRoutine}
                removeFromRoutine={removeFromRoutine}
              />
            }
          />
          <Route path="/rutinas" element={<RoutinePage />} />
          <Route
            path="/rutinas/:day"
            element={<DayRoutinePage routine={routine} removeFromRoutine={removeFromRoutine} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
