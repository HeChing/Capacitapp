import React, { useState } from 'react';
import {
  FaTrophy,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import './ProgressTracker.css';

const ProgressTracker = ({ course, enrollment }) => {
  const [isModulesOpen, setIsModulesOpen] = useState(false);

  const getTotalLessons = () => {
    return (
      course?.modules?.reduce(
        (total, module) => total + (module.lessons?.length || 0),
        0
      ) || 0
    );
  };

  const getCompletedLessons = () => {
    return enrollment?.completedLessons?.length || 0;
  };

  const getProgressPercentage = () => {
    return enrollment?.progress || 0;
  };

  const getModuleProgress = (moduleIndex) => {
    const module = course.modules?.[moduleIndex];
    if (!module || !module.lessons) return 0;

    const completedInModule =
      enrollment?.completedLessons?.filter((lessonKey) =>
        lessonKey.startsWith(`${moduleIndex}-`)
      ).length || 0;

    return Math.round((completedInModule / module.lessons.length) * 100);
  };

  const toggleModules = () => {
    setIsModulesOpen(!isModulesOpen);
  };

  return (
    <div className="progress-tracker">
      <div className="overall-progress">
        <div className="progress-header">
          <div className="progress-info">
            <FaChartLine className="progress-icon" />
            <div>
              <span className="progress-label">Progreso general</span>
              <span className="progress-stats">
                {getCompletedLessons()} de {getTotalLessons()} lecciones
              </span>
            </div>
          </div>
          <div className="progress-percentage">{getProgressPercentage()}%</div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      <div className="modules-progress">
        <div className="modules-header" onClick={toggleModules}>
          <h4>Progreso por módulos</h4>
          <div className="dropdown-icon">
            {isModulesOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>

        <div className={`modules-dropdown ${isModulesOpen ? 'open' : ''}`}>
          <div className="modules-list">
            {course?.modules?.map((module, index) => (
              <div key={index} className="module-progress-item">
                <div className="module-info">
                  <span className="module-title">{module.title}</span>
                  <span className="module-percentage">
                    {getModuleProgress(index)}%
                  </span>
                </div>
                <div className="module-progress-bar">
                  <div
                    className="module-progress-fill"
                    style={{ width: `${getModuleProgress(index)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {enrollment?.status === 'completed' && (
        <div className="completion-badge">
          <FaTrophy className="trophy-icon" />
          <div className="completion-text">
            <span>¡Curso completado!</span>
            <small>
              Completado el{' '}
              {new Date(enrollment.completedAt).toLocaleDateString()}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
