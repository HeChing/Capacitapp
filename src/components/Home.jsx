// src/components/Home.jsx
function Home({ correoUsuario }) {
  return (
    <div className="home-container">
      <h1>Bienvenido, {correoUsuario}</h1>
    </div>
  );
}

export default Home;
