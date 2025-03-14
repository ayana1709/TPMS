import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "../../Admin/src/pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
// import Dashboard from "./Dashboard"; // Example dashboard component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
