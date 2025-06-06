// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Si tienes Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
//                 element={<h1 className="text-red-500">No autorizado</h1>}
//             </Routes>
//           </div>
//         </Router>
