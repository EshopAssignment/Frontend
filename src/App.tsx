import OptionsBtn from "./components/Buttons/OptionsBtn";
import AppRouter from "./routes/AppRouter";


function App() {
  return (
    <div className="layout">
      <main>
        <OptionsBtn />
          <div>
          <AppRouter />
        </div>
      </main>
    </div>
  );
}

export default App
