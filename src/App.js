import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./styles/App.css";
import HomePage from "./pages/Home/HomePage";
import Header from "./components/Header";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
