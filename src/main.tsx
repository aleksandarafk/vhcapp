import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { TaskProvider } from './PersonalPlanner/TaskContext.tsx';
import { StudyJamProvider } from './StudyJam/StudyJamContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskProvider>
      <StudyJamProvider>
        <App />
      </StudyJamProvider>
    </TaskProvider>
  </StrictMode>,
);