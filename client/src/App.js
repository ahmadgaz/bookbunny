import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Home from "scenes/home";
import Login from "scenes/login";
import Register from "scenes/register";
import Dashboard from "scenes/dashboard";
import NewEvent from "scenes/newEvent";

function App() {
    const isAuth = Boolean(useSelector((state) => state.token));

    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuth ? <Navigate to="/dashboard" /> : <Home />
                        }
                        // errorElement={}
                    />
                    <Route
                        path="/login"
                        element={<Login />}
                        // errorElement={}
                    />
                    <Route
                        path="/register"
                        element={<Register />}
                        // errorElement={}
                    />
                    <Route
                        path="/dashboard"
                        element={isAuth ? <Dashboard /> : <Navigate to="/" />}
                        // errorElement={}
                    />
                    <Route path="/newEvent/:eventType" element={<NewEvent />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
