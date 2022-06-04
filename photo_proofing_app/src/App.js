import "./Sass/App.scss";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./Store/auth-context";

//Components
import Header from "./Components/Header";
import Footer from "./Components/Footer";

//Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import NewAlbum from "./Pages/NewAlbum";
import Album from "./Pages/Album";
import NotFound from "./Pages/NotFound";

function App() {
  const authContext = useContext(AuthContext);

  return (
    <Router>
        <Header />
        <main>
          <Routes>
            <Route exact path="/" element={<Home />} />
            {!authContext.isLoggedIn && (
              <>
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
              </>
            )}
            {authContext.isLoggedIn && (
              <>
                <Route exact path="/Profile" element={<Profile />} />
                <Route
                  exact
                  path="/Profile/Edit/:id"
                  element={<EditProfile />}
                />
                <Route exact path="Profile/Album/New" element={<NewAlbum />} />
                <Route exact path="Profile/Album/:id" element={<Album />} />
              </>
            )}
            {authContext.tokenTimeOver && (
              <Route path="*" element={<Login />} />
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
    </Router>
  );
}

export default App;
