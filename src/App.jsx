import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import Addblog from "./components/Addblog";
import MyBlogs from "./components/MyBlogs";
import BlogDetails from "./components/BlogDetails";
import AdminDashboard from "./components/AdminDashboard";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import "./App.css";
import { AuthProvider } from "./components/Context";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Nav />
          <main className="flex-grow">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/" element={<Home />} />
              <Route
                path="/add-blog"
                element={
                  <ProtectedRoute>
                    <Addblog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-blogs"
                element={
                  <ProtectedRoute>
                    <MyBlogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;