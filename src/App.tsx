import AppRouter from "./routes/AppRouter";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

function App() {
  return (
    <div className="layout">
      <Header /> 

      <main>
        <div>
          <AppRouter />
        </div>
      </main>
      
      <Footer /> 
    </div>
  );
}

export default App
