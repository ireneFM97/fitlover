import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb'; // Asegúrate de importar el componente Breadcrumb
import '../assets/styles/DayRoutinePage.css';

function DayRoutinePage({ routine, removeFromRoutine }) {
  const { day } = useParams(); // Obtener el parámetro del día de la URL
  const navigate = useNavigate(); // Instancia de useNavigate para redirigir
  const dayRoutine = routine[day.charAt(0).toUpperCase() + day.slice(1)] || []; // Capitaliza el día

  // Mapeo de días en inglés a español
  const dayInSpanish = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo',
  };

  // Estado local para manejar series de ejercicios
  const [exerciseSeries, setExerciseSeries] = useState({});
  const [isStarted, setIsStarted] = useState(false); // Estado para saber si la rutina ha comenzado
  const [pressedButton, setPressedButton] = useState(null);
  const [restTimers, setRestTimers] = useState({}); // Estado para manejar los temporizadores de descanso
  const [timerIntervals, setTimerIntervals] = useState({}); // Almacena los intervalos activos
  // Estado para manejar el estado de descanso (popup y fondo desenfocado)
  const [isResting, setIsResting] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Agregar el estado isHovered
  // Agregar estado para manejar si la rutina está parada
  const [isStopped, setIsStopped] = useState(false); // Nuevo estado
  const [exerciseNotes, setExerciseNotes] = useState({});

  // Cargar series desde el localStorage
  useEffect(() => {
    const storedSeries = localStorage.getItem('exerciseSeries');
    const storedNotes = localStorage.getItem('exerciseNotes');
    const initialSeries = {};
    const initialNotes = {};

    dayRoutine.forEach((exercise) => {
      const key = `${day}-${exercise.id}`;
      if (!storedSeries || !JSON.parse(storedSeries)[key]) {
        initialSeries[key] = [{ repeticiones: '', peso: '' }];
      }
      if (!storedNotes || !JSON.parse(storedNotes)[key]) {
        initialNotes[key] = '';
      }
    });

    setExerciseSeries((prevState) => ({
      ...initialSeries,
      ...JSON.parse(storedSeries || '{}'),
    }));

    setExerciseNotes((prevState) => ({
      ...initialNotes,
      ...JSON.parse(storedNotes || '{}'),
    }));
  }, [dayRoutine, day]);



  // Guardar series en el localStorage cuando exerciseSeries cambia
  useEffect(() => {
    localStorage.setItem('exerciseSeries', JSON.stringify(exerciseSeries));
  }, [exerciseSeries]);

  useEffect(() => {
    localStorage.setItem('exerciseNotes', JSON.stringify(exerciseNotes));
  }, [exerciseNotes]);

  // Función para manejar cambios en observaciones
  const handleNoteChange = (day, exerciseId, value) => {
    const key = `${day}-${exerciseId}`;
    setExerciseNotes((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const addSeries = (day, exerciseId, isCardio) => {
    const key = `${day}-${exerciseId}`; // Clave única basada en día y ejercicio
    setExerciseSeries(prevState => {
      const currentSeries = prevState[key] || []; // Obtén las series actuales si existen
      const newEntry = isCardio
        ? { vueltas: '', tiempo: '' }
        : { repeticiones: '', peso: '' };

      return {
        ...prevState,
        [key]: [...currentSeries, newEntry], // Añade una nueva serie
      };
    });
  };

  // Eliminar una serie de un ejercicio
  const removeSeries = (day, exerciseId, index) => {
    const key = `${day}-${exerciseId}`; // Clave única basada en día y ejercicio
    setExerciseSeries(prevState => {
      const currentSeries = prevState[key] || [];
      const updatedSeries = currentSeries.filter((_, i) => i !== index); // Elimina la serie específica

      return {
        ...prevState,
        [key]: updatedSeries, // Actualiza el estado con las series modificadas
      };
    });
  };

  // Actualizar valores de una serie
  const updateSeries = (day, exerciseId, index, field, value) => {
    const key = `${day}-${exerciseId}`;
    setExerciseSeries(prevState => {
      const updatedSeries = prevState[key].map((serie, i) =>
        i === index ? { ...serie, [field]: value } : serie
      );
      return {
        ...prevState,
        [key]: updatedSeries,
      };
    });
  };

  // Función para mover un ejercicio hacia arriba
  const moveUp = (exerciseId) => {
    const newRoutine = [...dayRoutine];
    const index = newRoutine.findIndex(exercise => exercise.id === exerciseId);

    if (index > 0) {
      // Intercambiar posiciones con el ejercicio anterior
      const temp = newRoutine[index];
      newRoutine[index] = newRoutine[index - 1];
      newRoutine[index - 1] = temp;
    }

    // Actualiza la rutina con la nueva posición
    routine[day.charAt(0).toUpperCase() + day.slice(1)] = newRoutine;
    // Actualiza el estado para que React vuelva a renderizar
    setExerciseSeries({ ...exerciseSeries });
  };

  // Función para mover un ejercicio hacia abajo
  const moveDown = (exerciseId) => {
    const newRoutine = [...dayRoutine];
    const index = newRoutine.findIndex(exercise => exercise.id === exerciseId);

    if (index < newRoutine.length - 1) {
      // Intercambiar posiciones con el siguiente ejercicio
      const temp = newRoutine[index];
      newRoutine[index] = newRoutine[index + 1];
      newRoutine[index + 1] = temp;
    }

    // Actualiza la rutina con la nueva posición
    routine[day.charAt(0).toUpperCase() + day.slice(1)] = newRoutine;
    // Actualiza el estado para que React vuelva a renderizar
    setExerciseSeries({ ...exerciseSeries });
  };

  // Función para manejar la acción del botón "S"
  const handleNext = (day, exerciseId, index) => {
    setPressedButton(`${day}-${exerciseId}-${index}`); // Almacenar el botón presionado
  };

  // Contar los ejercicios y las series
  const countExercisesAndSeries = () => {
    const exerciseCount = dayRoutine.length;
    const seriesCount = dayRoutine.reduce((acc, exercise) => acc + (exerciseSeries[`${day}-${exercise.id}`]?.length || 0), 0);
  };

  // Función para comenzar la rutina
  const startRoutine = () => {
    setIsStarted(true); // Cambiar estado a iniciado
    setIsStopped(false); // Asegurarse de que la rutina no está parada
    countExercisesAndSeries(); // Contar ejercicios y series
  };

  // Función para parar la rutina
  const stopRoutine = () => {
    setIsStarted(false); // Cambiar estado a detenido
    setIsStopped(true); // Indicar que la rutina está detenida
    // Eliminar los botones stop-routine-button, rest-button y button-check-serie 
  };

  // Función para manejar el botón "Descanso"
  const startRestTimer = (exerciseId) => {
    setRestTimers((prevTimers) => ({
      ...prevTimers,
      [exerciseId]: 60, // Tiempo inicial de descanso
    }));

    // Activar el desenfoque de fondo
    setIsResting(true); // Activamos el estado que indica que hay un popup visible


    const timerInterval = setInterval(() => {
      setRestTimers((prevTimers) => {
        const currentTime = prevTimers[exerciseId];

        if (currentTime <= 1) {
          clearInterval(timerInterval); // Limpiar el intervalo cuando llegue a 0
          setIsResting(false); // Desactivamos el estado de descanso
          return {
            ...prevTimers,
            [exerciseId]: undefined, // Elimina el temporizador
          };
        }

        return {
          ...prevTimers,
          [exerciseId]: currentTime - 1, // Resta 1 segundo
        };
      });
    }, 1000);

    // Guardar el identificador del intervalo
    setTimerIntervals((prevIntervals) => ({
      ...prevIntervals,
      [exerciseId]: timerInterval,
    }));
  };

  // Función para cerrar el popup y limpiar el temporizador
  const closePopup = (exerciseId) => {
    if (timerIntervals[exerciseId]) {
      clearInterval(timerIntervals[exerciseId]); // Limpiar el intervalo
    }

    setRestTimers((prevTimers) => ({
      ...prevTimers,
      [exerciseId]: undefined, // Remover el temporizador
    }));

    setTimerIntervals((prevIntervals) => {
      const updatedIntervals = { ...prevIntervals };
      delete updatedIntervals[exerciseId]; // Eliminar el identificador del intervalo
      return updatedIntervals;
    });
  };

  // Función para redirigir a la página de ejercicios
  const navigateToExercises = () => {
    navigate('/ejercicios'); // Redirigir a la página de ejercicios
  };

  return (
    <div className='day-routine-page'>
      {/* Breadcrumb con el día en español */}
      <Breadcrumb
        paths={[
          { name: 'Home', link: '/' },
          { name: 'Rutinas', link: '/rutinas' },
          { name: dayInSpanish[day.charAt(0).toUpperCase() + day.slice(1)], link: `/routine/${day}` },
        ]}
      />
      <h1>Rutina del {dayInSpanish[day.charAt(0).toUpperCase() + day.slice(1)]}</h1>
      {dayRoutine.length === 0 ? (
        <p>No hay ejercicios añadidos</p>
      ) : (
        <ul>
          {/* Botón para comenzar la rutina */}
          <button
            className="start-routine-button"
            onClick={startRoutine}
            onMouseEnter={() => setIsHovered(true)} // Detect mouse enter
            onMouseLeave={() => setIsHovered(false)} // Detect mouse leave
          >
            <span className={`button-text ${isHovered ? 'hide' : ''}`}>Comenzar rutina</span> {/* Ocultar el texto cuando se hace hover */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2.67em"
              height="1em"
              viewBox="0 0 512 192"
              className={`hover-svg ${isHovered ? 'show' : ''}`} // Aplicar la animación al SVG cuando se hace hover
            >
              <path
                fill="#313538"
                d="m292.533 13.295l1.124.75c13.212 8.725 22.685 20.691 28.917 35.15c1.496 2.243.499 3.49-2.493 4.237l-5.063 1.296c-11.447 2.949-20.53 5.429-31.827 8.378l-6.443 1.678c-2.32.574-2.96.333-5.428-2.477l-.348-.399c-3.519-3.988-6.155-6.652-10.817-9.03l-.899-.443c-15.705-7.727-30.911-5.484-45.12 3.74c-16.952 10.968-25.677 27.172-25.428 47.364c.25 19.942 13.96 36.395 33.654 39.137c16.951 2.244 31.16-3.739 42.378-16.452c2.244-2.743 4.238-5.734 6.73-9.224h-48.11c-5.235 0-6.481-3.24-4.736-7.478l.864-2.035c3.204-7.454 8.173-18.168 11.4-24.294l.704-1.319c.862-1.494 2.612-3.513 5.977-3.513h80.224c3.603-11.415 9.449-22.201 17.246-32.407c18.198-23.931 40.135-36.396 69.8-41.63c25.427-4.488 49.359-1.995 71.046 12.713c19.694 13.461 31.909 31.66 35.15 55.59c4.237 33.654-5.485 61.075-28.668 84.508c-16.453 16.702-36.645 27.172-59.829 31.908c-6.73 1.247-13.461 1.496-19.942 2.244c-22.685-.499-43.376-6.98-60.826-21.937c-12.273-10.61-20.727-23.648-24.928-38.828a105 105 0 0 1-10.47 16.89c-17.949 23.683-41.381 38.39-71.046 42.38c-24.43 3.24-47.115-1.497-67.058-16.454c-18.447-13.96-28.917-32.407-31.66-55.34c-3.24-27.173 4.737-51.603 21.19-73.041c17.7-23.184 41.132-37.891 69.8-43.126c22.999-4.16 45.037-1.595 64.936 11.464M411.12 49.017l-.798.178c-23.183 5.235-38.14 19.942-43.624 43.375c-4.488 19.444 4.985 39.138 22.934 47.115c13.71 5.983 27.421 5.235 40.633-1.496c19.694-10.22 30.413-26.175 31.66-47.613c-.25-3.24-.25-5.734-.749-8.227c-4.436-24.401-26.664-38.324-50.056-33.332M116.416 94.564c.997 0 1.496.748 1.496 1.745l-.499 5.983c0 .997-.997 1.745-1.745 1.745l-54.344-.249c-.997 0-1.246-.748-.748-1.496l3.49-6.232c.499-.748 1.496-1.496 2.493-1.496zM121.9 71.63c.997 0 1.496.748 1.247 1.496l-1.995 5.983c-.249.997-1.246 1.495-2.243 1.495l-117.912.25c-.997 0-1.246-.499-.748-1.247l5.235-6.73c.499-.748 1.745-1.247 2.493-1.247z"
              />
            </svg>
          </button>

          {dayRoutine.map(exercise => (
            <li key={exercise.id}>
              <div className="container-title-move-card">
                <h3 className="exercise-title title-routine">{exercise.name}</h3>
                <div className="container-button-up-down">
                  {/* Botones para mover arriba y abajo */}
                  <button className="moveUp-button" onClick={() => moveUp(exercise.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24">
                      <path fill="#313538" d="M11 11.8V15q0 .425.288.713T12 16t.713-.288T13 15v-3.2l.9.9q.275.275.7.275t.7-.275t.275-.7t-.275-.7l-2.6-2.6q-.3-.3-.7-.3t-.7.3l-2.6 2.6q-.275.275-.275.7t.275.7t.7.275t.7-.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" />
                    </svg>
                  </button>
                  <button className="moveUp-button" onClick={() => moveDown(exercise.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24">
                      <path fill="#313538" d="m11 12.2l-.9-.9q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7l2.6 2.6q.3.3.7.3t.7-.3l2.6-2.6q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275l-.9.9V9q0-.425-.288-.712T12 8t-.712.288T11 9zm1 9.8q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" />
                    </svg>
                  </button>
                </div>
              </div>
              <h4 className="exercise-muscle">{exercise.muscle}</h4>
              {exercise.video ? (
                <video className="exercise-video" controls>
                  <source src={exercise.video} type="video/mp4" />
                  Tu navegador no soporta el formato de video.
                </video>
              ) : (
                exercise.image && <img src={exercise.image} alt={exercise.name} />
              )}
              <p className="exercise-description">{exercise.description}</p>

              {/* Observaciones */}
              <textarea
                className='observaciones'
                value={exerciseNotes[`${day}-${exercise.id}`] || ''}
                onChange={(e) => handleNoteChange(day, exercise.id, e.target.value)}
                placeholder="Añade observaciones"
              />

              {/* Mostrar series para este ejercicio */}
              {exerciseSeries[`${day}-${exercise.id}`]?.length === 0 && (
                <div className="container-add-remove-reps">
                  <button className="button-series" onClick={() => addSeries(day, exercise.id, exercise.muscle === 'Cardio')}>+</button>
                </div>
              )}
              {exerciseSeries[`${day}-${exercise.id}`]?.map((serie, index) => (
                <div key={index} className="container-rep">
                  <div className='container-rep-kg'>
                    <label className="rep">{exercise.muscle === 'Cardio' ? 'Tiempo:' : 'Repeticiones:'}
                      <input
                        type="text"
                        value={serie[exercise.muscle === 'Cardio' ? 'tiempo' : 'repeticiones']}
                        onChange={(e) => updateSeries(day, exercise.id, index, exercise.muscle === 'Cardio' ? 'tiempo' : 'repeticiones', e.target.value)}
                        placeholder={exercise.muscle === 'Cardio' ? 'Tiempo' : 'Reps'}
                      />
                    </label>
                    <label className="kg">{exercise.muscle === 'Cardio' ? 'Vueltas:' : 'Peso:'}
                      <input
                        type="text"
                        value={serie[exercise.muscle === 'Cardio' ? 'vueltas' : 'peso']}
                        onChange={(e) => updateSeries(day, exercise.id, index, exercise.muscle === 'Cardio' ? 'vueltas' : 'peso', e.target.value)}
                        placeholder={exercise.muscle === 'Cardio' ? 'Vueltas' : 'Kg'}
                      />
                    </label>
                  </div>
                  <div className="container-add-remove-reps">
                    <button className="button-series" onClick={() => addSeries(day, exercise.id, exercise.muscle === 'Cardio')}>+</button>
                    <button className="button-series" onClick={() => removeSeries(day, exercise.id, index)}>-</button>
                    {isStarted && (
                      <button
                        className={`button-check-serie ${pressedButton === `${day}-${exercise.id}-${index}` ? 'pressed' : ''}`}
                        onClick={() => handleNext(day, exercise.id, index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c-1.11 0-2 .89-2 2s.89 2 2 2s2-.89 2-2s-.89-2-2-2m10-4v5h-2V4H4v2H2V1h2v2h16V1zm-7 10.26V23h-2v-5h-2v5H9V11.26C6.93 10.17 5.5 8 5.5 5.5V5h2v.5C7.5 8 9.5 10 12 10s4.5-2 4.5-4.5V5h2v.5c0 2.5-1.43 4.67-3.5 5.76" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {/* Botón "Descanso" que aparece solo si la rutina ha comenzado */}
              {isStarted && (
                <>
                  <div className='rest-container'>
                    <button
                      className={`rest-button ${isStopped ? 'hidden' : ''}`}
                      onClick={() => startRestTimer(exercise.id)}
                    >
                      Descanso
                    </button>
                    {restTimers[exercise.id] !== undefined && (
                      <div className="popup">
                        <div className="popup-content">
                          <p>Tiempo restante: {restTimers[exercise.id]} segundos</p>
                          <button
                            className="close-popup"
                            onClick={() => closePopup(exercise.id)}
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      className={`stop-routine-button ${isStopped ? 'hidden' : ''}`}
                      onClick={stopRoutine}
                    >
                      Parar rutina
                    </button>
                  </div>
                </>
              )}
              <button className="remove-button" onClick={() => removeFromRoutine(day.charAt(0).toUpperCase() + day.slice(1), exercise.id)}>
                Eliminar ejercicio
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* Botón para añadir un nuevo ejercicio */}
      <button
        className="start-routine-button"
        onClick={navigateToExercises}
        onMouseEnter={() => setIsHovered(true)} // Detect mouse enter
        onMouseLeave={() => setIsHovered(false)} // Detect mouse leave
      >
        <span className={`button-text ${isHovered ? 'hide' : ''}`}>Añadir ejercicio</span> {/* Ocultar el texto cuando se hace hover */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          viewBox="0 0 24 24"
          className={`hover-svg ${isHovered ? 'show' : ''}`} // Aplicar la animación al SVG cuando se hace hover
        >
          <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
        </svg>
      </button>
    </div>
  );
}

export default DayRoutinePage;
