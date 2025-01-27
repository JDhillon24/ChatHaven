import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RequireAuth from "./Components/RequireAuth";
import PersistLogin from "./Components/PersistLogin";
import "./App.css";
import ScrollToTop from "./Components/ScrollToTop";
import Login from "./Routes/Login";
import Home from "./Routes/Home";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/Home" element={<Home />} />
          </Route>
        </Route>
        <Route path="/Login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
