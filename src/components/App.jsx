import GameManager from "./GameManager";
import "../components/style/App.css";
import Footer from "./Footer";

function App() {
  return (
    <>
      <div className="content-container">
        <h1 className="header">Classic Snake Game</h1>
        <GameManager />
      </div>
      <Footer />
    </>
  );
}

export default App;
