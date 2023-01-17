import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Home from "scenes/home";
import Login from "scenes/login";
import Register from "scenes/register";
import Dashboard from "scenes/dashboard";

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
                    />
                    <Route
                        path="/login"
                        element={
                            isAuth ? <Navigate to="/dashboard" /> : <Login />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            isAuth ? <Navigate to="/dashboard" /> : <Register />
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={isAuth ? <Dashboard /> : <Navigate to="/" />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
