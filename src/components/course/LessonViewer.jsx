// ✅ MODIFICAR: src/components/course/LessonViewer.jsx
import React, { useState, useEffect } from 'react';
import {
  FaPlay,
  FaDownload,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaSpinner,
  FaQuestionCircle,
  FaTimesCircle,
  FaTrophy,
} from 'react-icons/fa';
import './LessonViewer.css';

const LessonViewer = ({ lesson, isCompleted, onComplete }) => {
  const [lessonCompleted, setLessonCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);

  // Estados para el quiz
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (lesson.type === 'quiz' && lesson.content) {
      try {
        const parsedQuiz = JSON.parse(lesson.content);
        setQuizData(parsedQuiz);
      } catch (error) {
        console.error('Error parsing quiz data:', error);
      }
    }
  }, [lesson]);

  const handleMarkComplete = async () => {
    if (lessonCompleted) return;

    setLoading(true);
    try {
      await onComplete();
      setLessonCompleted(true);
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funciones del quiz
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (showResults) return;

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    setShowResults(true);
    const score = calculateScore();
    const passed = score >= 70;

    if (passed) {
      setLessonCompleted(true);
      if (onComplete) {
        await onComplete();
      }
    }
  };

  const calculateScore = () => {
    if (!quizData || !quizData.questions) return 0;

    const correctAnswers = quizData.questions.filter((question, index) => {
      return answers[index] === question.correctAnswer;
    }).length;

    return Math.round((correctAnswers / quizData.questions.length) * 100);
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setLessonCompleted(false);
    setQuizStarted(false);
  };

  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="video-content">
            {lesson.content?.includes('youtube.com') ||
            lesson.content?.includes('youtu.be') ? (
              <div className="video-wrapper">
                <iframe
                  src={getYouTubeEmbedUrl(lesson.content)}
                  title={lesson.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            ) : lesson.content?.includes('vimeo.com') ? (
              <div className="video-wrapper">
                <iframe
                  src={getVimeoEmbedUrl(lesson.content)}
                  title={lesson.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="video-placeholder">
                <FaPlay />
                <p>Video: {lesson.content}</p>
                <small>Formato de video no soportado para vista previa</small>
              </div>
            )}
          </div>
        );

      case 'document':
        return (
          <div className="document-content">
            {lesson.content?.endsWith('.pdf') ? (
              <div className="pdf-viewer">
                <iframe
                  src={lesson.content}
                  title={lesson.title}
                  width="100%"
                  height="600px"
                ></iframe>
              </div>
            ) : (
              <div className="document-placeholder">
                <FaDownload />
                <h4>Documento: {lesson.title}</h4>
                <p>Haz clic para descargar o abrir el documento</p>
                <a
                  href={lesson.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-download"
                >
                  <FaDownload />
                  Descargar documento
                </a>
              </div>
            )}
          </div>
        );

      case 'link':
        return (
          <div className="link-content">
            <div className="link-card">
              <FaExternalLinkAlt />
              <h4>Enlace externo</h4>
              <p>Este contenido se abrirá en una nueva ventana</p>
              <a
                href={lesson.content}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-external-link"
              >
                <FaExternalLinkAlt />
                Abrir enlace
              </a>
            </div>
          </div>
        );

      case 'quiz': {
        if (
          !quizData ||
          !quizData.questions ||
          quizData.questions.length === 0
        ) {
          return (
            <div className="document-placeholder">
              <FaQuestionCircle />
              <h4>Quiz no configurado</h4>
              <p>Este quiz no tiene preguntas configuradas.</p>
            </div>
          );
        }

        // Pantalla de inicio del quiz
        if (!quizStarted && !showResults) {
          return (
            <div className="link-card">
              <FaQuestionCircle />
              <h4>{quizData.title || 'Quiz'}</h4>
              <p>
                {quizData.description ||
                  'Responde las preguntas para completar esta lección'}
              </p>
              <div className="lesson-preview">
                <span>{quizData.questions.length} preguntas</span>
                <span>
                  Tiempo estimado:{' '}
                  {Math.max(1, Math.ceil(quizData.questions.length * 1.5))} min
                </span>
                <span>Puntuación mínima: 70%</span>
              </div>
              <button
                className="btn-external-link"
                onClick={() => setQuizStarted(true)}
              >
                <FaQuestionCircle />
                Comenzar Quiz
              </button>
            </div>
          );
        }

        // Pantalla de resultados
        if (showResults) {
          const score = calculateScore();
          const passed = score >= 70;
          const correctAnswers = quizData.questions.filter(
            (q, i) => answers[i] === q.correctAnswer
          ).length;

          return (
            <div className="document-content">
              <div className="link-card">
                {passed ? (
                  <FaTrophy style={{ color: '#ffc107', fontSize: '48px' }} />
                ) : (
                  <FaTimesCircle
                    style={{ color: '#dc3545', fontSize: '48px' }}
                  />
                )}
                <h4>{passed ? '¡Felicidades!' : 'Intenta de nuevo'}</h4>
                <p>Puntuación: {score}%</p>
                <div className="lesson-preview">
                  <span>
                    Correctas: {correctAnswers} de {quizData.questions.length}
                  </span>
                  <span className={passed ? 'passed' : 'failed'}>
                    {passed ? 'Aprobado' : 'Reprobado'}
                  </span>
                </div>
                <button className="btn-external-link" onClick={restartQuiz}>
                  <FaQuestionCircle />
                  Reintentar Quiz
                </button>
              </div>

              <div style={{ marginTop: '20px' }}>
                <h4>Revisión de respuestas:</h4>
                {quizData.questions.map((question, index) => {
                  const isCorrect = answers[index] === question.correctAnswer;
                  const userAnswer = answers[index];

                  return (
                    <div
                      key={index}
                      className="link-card"
                      style={{ marginBottom: '15px' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        {isCorrect ? (
                          <FaCheckCircle style={{ color: '#28a745' }} />
                        ) : (
                          <FaTimesCircle style={{ color: '#dc3545' }} />
                        )}
                        <span>
                          <strong>Pregunta {index + 1}:</strong>{' '}
                          {question.question}
                        </span>
                      </div>

                      {userAnswer !== undefined && (
                        <p
                          style={{
                            color: isCorrect ? '#28a745' : '#dc3545',
                            margin: '5px 0',
                          }}
                        >
                          <strong>Tu respuesta:</strong>{' '}
                          {question.options[userAnswer]}
                        </p>
                      )}

                      {!isCorrect && (
                        <p style={{ color: '#28a745', margin: '5px 0' }}>
                          <strong>Respuesta correcta:</strong>{' '}
                          {question.options[question.correctAnswer]}
                        </p>
                      )}

                      {question.explanation && (
                        <p style={{ color: '#666', margin: '5px 0' }}>
                          <strong>Explicación:</strong> {question.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // Pantalla de preguntas
        const currentQuestion = quizData.questions[currentQuestionIndex];
        const allAnswered = quizData.questions.every(
          (_, index) => answers[index] !== undefined
        );

        return (
          <div className="document-content">
            <div className="lesson-preview" style={{ marginBottom: '20px' }}>
              <span>
                Pregunta {currentQuestionIndex + 1} de{' '}
                {quizData.questions.length}
              </span>
              <div style={{ display: 'flex', gap: '5px' }}>
                {quizData.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    style={{
                      padding: '5px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background:
                        index === currentQuestionIndex
                          ? '#667eea'
                          : answers[index] !== undefined
                            ? '#28a745'
                            : '#f8f9fa',
                      color:
                        index === currentQuestionIndex ||
                        answers[index] !== undefined
                          ? 'white'
                          : 'black',
                      cursor: 'pointer',
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="link-card">
              <h4>Pregunta {currentQuestionIndex + 1}</h4>
              <p>{currentQuestion.question}</p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '20px',
                }}
              >
                {currentQuestion.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() =>
                      handleAnswerSelect(currentQuestionIndex, optionIndex)
                    }
                    style={{
                      padding: '15px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      background:
                        answers[currentQuestionIndex] === optionIndex
                          ? '#667eea'
                          : 'white',
                      color:
                        answers[currentQuestionIndex] === optionIndex
                          ? 'white'
                          : 'black',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 'bold',
                        minWidth: '30px',
                        textAlign: 'center',
                        padding: '5px',
                        borderRadius: '50%',
                        background:
                          answers[currentQuestionIndex] === optionIndex
                            ? 'rgba(255,255,255,0.3)'
                            : '#f8f9fa',
                      }}
                    >
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '20px',
                }}
              >
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.max(0, currentQuestionIndex - 1)
                    )
                  }
                  disabled={currentQuestionIndex === 0}
                  className="btn-download"
                  style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
                >
                  Anterior
                </button>

                {allAnswered && (
                  <button
                    className="btn-external-link"
                    onClick={handleSubmitQuiz}
                  >
                    <FaCheckCircle />
                    Enviar Quiz
                  </button>
                )}

                <button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.min(
                        quizData.questions.length - 1,
                        currentQuestionIndex + 1
                      )
                    )
                  }
                  disabled={
                    currentQuestionIndex === quizData.questions.length - 1
                  }
                  className="btn-download"
                  style={{
                    opacity:
                      currentQuestionIndex === quizData.questions.length - 1
                        ? 0.5
                        : 1,
                  }}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="unknown-content">
            <p>Tipo de contenido no reconocido</p>
          </div>
        );
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];
      const params = new URLSearchParams({
        autoplay: '0',
        controls: '1',
        modestbranding: '1',
        rel: '0',
        showinfo: '1',
        fs: '1',
        cc_load_policy: '1',
        iv_load_policy: '3',
        playsinline: '1',
      });

      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    }

    return url;
  };

  const getVimeoEmbedUrl = (url) => {
    const regExp = /vimeo\.com\/(\d+)/;
    const match = url.match(regExp);
    return match ? `https://player.vimeo.com/video/${match[1]}` : url;
  };

  return (
    <div className="lesson-viewer">
      <div className="lesson-header">
        <div className="lesson-info">
          <h2>{lesson.title}</h2>
          <div className="lesson-meta">
            <span className="lesson-type">{lesson.type}</span>
            <span className="lesson-duration">{lesson.duration} minutos</span>
            {lesson.isRequired && (
              <span className="required-badge">Obligatorio</span>
            )}
          </div>
        </div>

        {lesson.type !== 'quiz' && (
          <div className="lesson-actions">
            {lessonCompleted ? (
              <div className="completed-badge">
                <FaCheckCircle />
                Completado
              </div>
            ) : (
              <button
                className="btn-complete"
                onClick={handleMarkComplete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Marcando...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Marcar como completado
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {lesson.description && (
        <div className="lesson-description">
          <p>{lesson.description}</p>
        </div>
      )}

      <div className="lesson-content">{renderLessonContent()}</div>

      {lesson.type !== 'quiz' && (
        <div className="lesson-footer">
          <div className="lesson-objectives">
            <h4>Objetivos de aprendizaje</h4>
            <p>
              Al completar esta lección, deberías ser capaz de entender los
              conceptos presentados.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonViewer;
