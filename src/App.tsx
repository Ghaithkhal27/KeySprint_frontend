import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Profile from "./pages/ProfilePage";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import Levels from "./pages/LevelsPage";
import TestPage from "./pages/TestPage";


const ProtectedLayout = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const MainLayout = () => (
  <>
    <Navbar />
    <div className="bg-[#8ecae6] mt-[40px]">
    <Outlet />
    </div>
  </>
);

const App: React.FC = () => {
  return (
    <Router> 
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        <Route element={<ProtectedLayout />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/UsersPage" element={<UsersPage />} />
            <Route path="/TestPage" element={<TestPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/Levels" element={<Levels />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
