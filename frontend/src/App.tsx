import { Route, Routes, useLocation } from "react-router-dom";
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
import { NavigationTracker } from "./hooks/useNavigationTracker";
import EditProfile from "./Routes/EditProfile";
import Verify from "./Routes/Verify";
import ForgotPassword from "./Routes/ForgotPassword";
import ResetPassword from "./Routes/ResetPassword";
import LandingPage from "./Routes/LandingPage";
import SmoothScrollWrapper from "./Components/SmoothScrollWrapper";
import { AnimatePresence } from "framer-motion";
import MotionWrapper from "./Components/MotionWrapper";

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <NavigationTracker>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route element={<SmoothScrollWrapper />}>
              <Route element={<PersistLogin />}>
                {/* Protected Routes */}
                <Route element={<RequireAuth />}>
                  <Route element={<SocketWrapper />}>
                    <Route path="/Home" element={<Home />} />
                    <Route path="/Friends" element={<Friends />} />
                    <Route path="/Notifications" element={<Notifications />} />
                    <Route
                      path="/EditProfile"
                      element={
                        <MotionWrapper>
                          <EditProfile />
                        </MotionWrapper>
                      }
                    />
                  </Route>
                </Route>
              </Route>
              <Route path="/Login" element={<Login />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/ResetPassword" element={<ResetPassword />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Verify" element={<Verify />} />
              <Route path="/" element={<LandingPage />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </NavigationTracker>
    </>
  );
}

export default App;
