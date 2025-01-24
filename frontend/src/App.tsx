import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RequireAuth from "./Components/RequireAuth";
import "./App.css";
import ScrollToTop from "./Components/ScrollToTop";
import Login from "./Routes/Login";
import Home from "./Routes/Home";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/Home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
