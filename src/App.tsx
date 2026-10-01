import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CoursePage from "./pages/CoursePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses/:id" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;