import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RequireAuth from "./Components/RequireAuth";
import PersistLogin from "./Components/PersistLogin";
import "./App.css";
import ScrollToTop from "./Components/ScrollToTop";
import Login from "./Routes/Login";
import Home from "./Routes/Home";
import Register from "./Routes/Register";
import Friends from "./Routes/Friends";
import Notifications from "./Routes/Notifications";
import SocketWrapper from "./Components/SocketWrapper";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route element={<SocketWrapper />}>
              <Route path="/Home" element={<Home />} />
              <Route path="/Friends" element={<Friends />} />
              <Route path="/Notifications" element={<Notifications />} />
            </Route>
          </Route>
        </Route>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
