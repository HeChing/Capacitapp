// ✅ MODIFICAR: src/components/course/ContentUploader.jsx
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebaseConfig';
import {
  FaUpload,
  FaLink,
  FaSpinner,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import './ContentUploader.css';

const ContentUploader = ({ lessonType, currentContent, onContentUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [quizData, setQuizData] = useState(() => {
    if (lessonType === 'quiz' && currentContent) {
      try {
        return JSON.parse(currentContent);
      } catch {
        return {
          title: '',
          description: '',
          questions: [],
        };
      }
    }
    return {
      title: '',
      description: '',
      questions: [],
    };
  });

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      const fileName = `courses/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      onContentUpdate(downloadURL);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  // Funciones para manejar el quiz
  const updateQuizData = (newData) => {
    setQuizData(newData);
    onContentUpdate(JSON.stringify(newData, null, 2));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    };

    updateQuizData({
      ...quizData,
      questions: [...quizData.questions, newQuestion],
    });
  };

  const updateQuestion = (questionIndex, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value,
    };

    updateQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;

    updateQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const deleteQuestion = (questionIndex) => {
    if (window.confirm('¿Estás seguro de eliminar esta pregunta?')) {
      const updatedQuestions = quizData.questions.filter(
        (_, index) => index !== questionIndex
      );
      updateQuizData({
        ...quizData,
        questions: updatedQuestions,
      });
    }
  };

  const moveQuestion = (questionIndex, direction) => {
    const newIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1;
    if (newIndex < 0 || newIndex >= quizData.questions.length) return;

    const updatedQuestions = [...quizData.questions];
    [updatedQuestions[questionIndex], updatedQuestions[newIndex]] = [
      updatedQuestions[newIndex],
      updatedQuestions[questionIndex],
    ];

    updateQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const renderQuizBuilder = () => (
    <div className="quiz-builder">
      <div className="quiz-header">
        <div className="form-group">
          <label>Título del Quiz</label>
          <input
            type="text"
            placeholder="Ingresa el título del quiz"
            value={quizData.title}
            onChange={(e) =>
              updateQuizData({ ...quizData, title: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            placeholder="Descripción del quiz (opcional)"
            value={quizData.description}
            onChange={(e) =>
              updateQuizData({ ...quizData, description: e.target.value })
            }
            rows="2"
          />
        </div>
      </div>

      <div className="questions-section">
        <div className="questions-header">
          <h4>Preguntas ({quizData.questions.length})</h4>
          <button className="btn-add-question" onClick={addQuestion}>
            <FaPlus />
            Agregar Pregunta
          </button>
        </div>

        <div className="questions-list">
          {quizData.questions.map((question, questionIndex) => (
            <div key={question.id} className="question-item">
              <div className="question-header">
                <span className="question-number">
                  Pregunta {questionIndex + 1}
                </span>
                <div className="question-actions">
                  <button
                    onClick={() => moveQuestion(questionIndex, 'up')}
                    disabled={questionIndex === 0}
                    className="btn-move"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    onClick={() => moveQuestion(questionIndex, 'down')}
                    disabled={questionIndex === quizData.questions.length - 1}
                    className="btn-move"
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    onClick={() => deleteQuestion(questionIndex)}
                    className="btn-delete-question"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="question-content">
                <div className="form-group">
                  <label>Pregunta</label>
                  <textarea
                    placeholder="Escribe tu pregunta aquí"
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(questionIndex, 'question', e.target.value)
                    }
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>Opciones de respuesta</label>
                  <div className="options-list">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="option-item">
                        <div className="option-input">
                          <input
                            type="text"
                            placeholder={`Opción ${String.fromCharCode(65 + optionIndex)}`}
                            value={option}
                            onChange={(e) =>
                              updateQuestionOption(
                                questionIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="option-correct">
                          <label>
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() =>
                                updateQuestion(
                                  questionIndex,
                                  'correctAnswer',
                                  optionIndex
                                )
                              }
                            />
                            <span className="radio-label">Correcta</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Explicación (opcional)</label>
                  <textarea
                    placeholder="Explica por qué esta es la respuesta correcta"
                    value={question.explanation}
                    onChange={(e) =>
                      updateQuestion(
                        questionIndex,
                        'explanation',
                        e.target.value
                      )
                    }
                    rows="2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {quizData.questions.length === 0 && (
          <div className="empty-questions">
            <p>No hay preguntas creadas aún</p>
            <button className="btn-primary" onClick={addQuestion}>
              Crear primera pregunta
            </button>
          </div>
        )}
      </div>

      {quizData.questions.length > 0 && (
        <div className="quiz-preview">
          <h4>Vista previa del Quiz</h4>
          <div className="preview-content">
            <h5>{quizData.title || 'Sin título'}</h5>
            {quizData.description && <p>{quizData.description}</p>}
            <div className="preview-stats">
              <span>{quizData.questions.length} preguntas</span>
              <span>
                Tiempo estimado:{' '}
                {Math.max(1, Math.ceil(quizData.questions.length * 1.5))}{' '}
                minutos
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUploader = () => {
    switch (lessonType) {
      case 'video':
        return (
          <div className="content-uploader">
            <label>Contenido del Video</label>
            <div className="upload-options">
              <div className="upload-section">
                <h6>Subir Video</h6>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  disabled={uploading}
                />
                {uploading && (
                  <div className="upload-progress">
                    <FaSpinner className="spinner" />
                    Subiendo video...
                  </div>
                )}
              </div>

              <div className="divider">O</div>

              <div className="url-section">
                <h6>URL del Video (YouTube, Vimeo, etc.)</h6>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={currentContent}
                  onChange={(e) => onContentUpdate(e.target.value)}
                />
              </div>
            </div>
            {currentContent && (
              <div className="content-preview">
                <p>Contenido actual: {currentContent}</p>
              </div>
            )}
          </div>
        );

      case 'document':
        return (
          <div className="content-uploader">
            <label>Documento</label>
            <div className="upload-options">
              <div className="upload-section">
                <h6>Subir Documento</h6>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  disabled={uploading}
                />
                {uploading && (
                  <div className="upload-progress">
                    <FaSpinner className="spinner" />
                    Subiendo documento...
                  </div>
                )}
              </div>

              <div className="divider">O</div>

              <div className="url-section">
                <h6>URL del Documento</h6>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/documento.pdf"
                  value={currentContent}
                  onChange={(e) => onContentUpdate(e.target.value)}
                />
              </div>
            </div>
            {currentContent && (
              <div className="content-preview">
                <p>Documento actual: {currentContent}</p>
              </div>
            )}
          </div>
        );

      case 'link':
        return (
          <div className="content-uploader">
            <label>Enlace</label>
            <input
              type="url"
              placeholder="https://ejemplo.com"
              value={currentContent}
              onChange={(e) => onContentUpdate(e.target.value)}
            />
            {currentContent && (
              <div className="content-preview">
                <FaLink />
                <a
                  href={currentContent}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentContent}
                </a>
              </div>
            )}
          </div>
        );

      case 'quiz':
        return renderQuizBuilder();

      default:
        return (
          <div className="content-uploader">
            <p>Selecciona un tipo de contenido</p>
          </div>
        );
    }
  };

  return <div className="content-uploader-wrapper">{renderUploader()}</div>;
};

export default ContentUploader;
