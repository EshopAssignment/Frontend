import OptionsBtn from "./components/Buttons/OptionsBtn";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
      <main>
        <Toaster 
        position="bottom-center"
        gutter={16}
        toastOptions={{
          className: 'toaster-style',
          duration:7000,
        }}  />
        <OptionsBtn />
        <AppRouter />
      </main>
    </>
  );
}

export default App
