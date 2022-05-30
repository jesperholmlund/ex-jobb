import { Link } from "react-router-dom";
import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LogOutButton from "../Components/LogOutButton";
import AuthContext from "../Store/auth-context";
import Loading from "../Images/loading.svg";
import TitleRename from "../utility/TitleRename";

const Login = () => {
  TitleRename("Photo Proof - Login");

  const emailRef = useRef(); //
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext.isLoggedIn; //Inloggad om true vilket beror på om vi har en token

  useEffect(() => {
    if (!isLoggedIn) {
      //Om vi inte är inloggade
      emailRef.current.focus(); //Fokus på email
    }
  }, [isLoggedIn]); //Kör när isLoggedIn ändras

  useEffect(() => {
    setError(""); //Nollställ error
  }, [email, password]); //Kör när email eller password ändras

  const handleSubmit = async (e) => {
    e.preventDefault(); //Förhindra att sidan laddas om
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const json = await response.json();
      if (json.error) {
        setLoading(false);
        setError(json.error);
      } else {
        //LYCKAD INLOGGNING
        setLoading(false);
        const token = json.token;
        const id = json._id;
        localStorage.setItem("email", email); //Lägg till email i localStorage
        localStorage.setItem("token", token); //Lägg till token i localStorage
        localStorage.setItem("id", id); //Lägg till ID i localStorage
        authContext.login(token); //Lägg till token i authContext
        console.log(123, localStorage.getItem("token"));
        navigate("/Profile"); //Navigera till profile
      }
    } catch (err) {
      setLoading(false);
      //Kolla om det gick fel
      setError("Something went wrong");

      //nollställ
      setPassword("");
    }
  };
  if (loading) {
    return (
      <div className="loading">
        <img src={Loading} alt="loading" />
      </div>
    );
  }
  return (
    <div>
      {authContext.tokenTimeOver && (
        <div className="autoLoggedOut">
          <span>You were automatically logged out</span>
        </div>
      )}
      {isLoggedIn ? (
        <div className="centerBox">
          <span>
            You are logged in as <span>{localStorage.getItem("email")}</span>
          </span>
          <br></br>
          <LogOutButton />
        </div>
      ) : (
        <form className="loginForm" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="formDiv">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email_login"
              ref={emailRef}
              autoComplete="on"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="formDiv">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password_login"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error ? (
            <div className="formDiv">
              <p ref={emailRef} className="warning" aria-live="assertive">
                {error}
              </p>
            </div>
          ) : null}
          <div className="formDiv">
            <input type="submit" id="submit_login" value="Login" />
          </div>
          <div className="formDiv">
            <Link to="/register">Create new Account</Link>
          </div>
        </form>
      )}
    </div>
  );
};
export default Login;
