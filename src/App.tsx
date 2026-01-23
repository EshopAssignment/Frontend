import OptionsBtn from "./components/Buttons/OptionsBtn";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
      <main>
        <Toaster  />
        <OptionsBtn />
        <AppRouter />
      </main>
    </>
  );
}

export default App
