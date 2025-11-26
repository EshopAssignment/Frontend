import { QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./routes/AppRouter";
import { queryClient } from "./api/queryClient";


function App() {
  return (
  <QueryClientProvider client={queryClient}>
    <div className="layout">
      <main>
        <div>
          <AppRouter />
        </div>
      </main>
    </div>
  </QueryClientProvider>
  );
}

export default App
