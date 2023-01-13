import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Home from "scenes/home";
import Login from "scenes/login";
import Dashboard from "scenes/dashboard";

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
