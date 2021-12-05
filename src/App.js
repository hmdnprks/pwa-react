import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";

const queryClient = new QueryClient();
export const Context = React.createContext(null);

function App() {
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);

  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      console.log("Install Prompt fired");
      setDeferredPrompt(e);
    })
  }, [])

  const savePrompt = val => {
    setDeferredPrompt(val);
  }

  return (
      <div className="App">
        <QueryClientProvider client={queryClient}>
          <Context.Provider value={{ installPrompt: { deferredPrompt, savePrompt }}}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="about" element={<About />} />
            </Routes>
          </Context.Provider>
        </QueryClientProvider>
      </div>
  );
}

export default App;