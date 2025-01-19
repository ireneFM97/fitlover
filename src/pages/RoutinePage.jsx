import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/RoutinePage.css';
import Breadcrumb from '../components/Breadcrumb';
import CardDays from '../components/CardDays';

function RoutinePage() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const descriptions = {
    Monday: "Fuerza --> Pecho, Hombro y Tríceps",
    Tuesday: "Pierna y CORE",
    Wednesday: "Fuerza --> Espalda y Bíceps",
    Thursday: "Pierna y CORE",
    Friday: "Cardio HIIT"
  };

  const times = {
    Monday: "30 min",
    Tuesday: "45 min",
    Wednesday: "40 min",
    Thursday: "50 min",
    Friday: "35 min"
  };

  const paths = [
    { name: 'Home', link: '/' },
    { name: 'Rutinas', link: '/rutinas' }
  ];

  return (
    <div className="routine-page">
      {/* Breadcrumb */}
      <Breadcrumb paths={paths} />
      <div className='content-routines'>
        <h1>Planificación semanal</h1>
        <div className="routine-cards-container">
          {daysOfWeek.map((day) => (
            <CardDays
              key={day}
              title={day}
              link={`/rutinas/${day.toLowerCase()}`}
              description={descriptions[day]} // Descripción dinámica
              time={times[day]} // Tiempo dinámico
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoutinePage;
