import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./Pages/AdminLogin";
// import Dashboard from "./Dashboard"; // Example dashboard component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
