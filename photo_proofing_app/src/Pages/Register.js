import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Images/loading.svg";
import TitleRename from "../utility/TitleRename";

const Register = () => {
  TitleRename("Photo Proof - Register");

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [first, last, company, email, password, repeat, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== repeat) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: {
            first,
            last,
          },
          company,
          email,
          password,
          role,
        }),
      });
      const json = await response.json();
      if (json.error) {
        setLoading(false);
        setError(json.error);
      } else {
        //LYCKAT REGISTRERING
        setLoading(false);
        navigate("/login");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong");

      //nollställ
      setFirst("");
      setLast("");
      setCompany("");
      setEmail("");
      setPassword("");
      setRepeat("");
      setRole("");
    }
  };

  if (loading)
    return (
      <div className="loading">
        <img src={Loading} alt="loading" />
      </div>
    );
  return (
    <>
      <form className="registerForm" onSubmit={handleSubmit}>
        <h1>Register Account</h1>
        <div className="formDiv">
          <label htmlFor="first">First Name *</label>
          <input
            type="text"
            id="first"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
          />
        </div>
        <div className="formDiv">
          <label htmlFor="last">Last Name *</label>
          <input
            type="text"
            id="last"
            value={last}
            onChange={(e) => setLast(e.target.value)}
          />
        </div>
        <div className="formDiv">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="formDiv">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className="formDiv">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="formDiv">
          <label htmlFor="repeat">Repeat Password *</label>
          <input
            type="password"
            id="repeat"
            onChange={(e) => setRepeat(e.target.value)}
          />
        </div>
        <div className="formDiv">
          <label htmlFor="role">Role *</label>
          <div className="radioDiv">
            <input
              type="radio"
              name="role"
              value="Customer"
              onChange={(e) => setRole(e.target.value)}
            />
            <span>Customer</span>
          </div>
          <div className="radioDiv">
            <input
              type="radio"
              name="role"
              value="Photographer"
              onChange={(e) => setRole(e.target.value)}
            />
            <span>Photographer</span>
          </div>
        </div>
        {error ? (
          <div className="formDiv">
            <p className="warning" aria-live="assertive">
              {error}
            </p>
          </div>
        ) : null}
        <div className="formDiv">
          <input type="submit" id="submit" value="Register" />
        </div>
      </form>
    </>
  );
};
export default Register;
