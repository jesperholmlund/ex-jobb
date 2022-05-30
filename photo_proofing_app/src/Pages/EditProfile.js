import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../Images/loading.svg";
import axios from "axios";
import TitleRename from "../utility/TitleRename";

const EditProfile = () => {
  TitleRename("Photo Proof - Edit Profile");

  const location = useLocation();
  const navigate = useNavigate();

  const [first, setFirst] = useState(location.state.first);
  const [last, setLast] = useState(location.state.last);
  const [company, setCompany] = useState(location.state.company);
  const [bio, setBio] = useState(location.state.bio);
  const [profilePicture] = useState(location.state.profilePicture);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");

  useEffect(() => {
    setError("");
  }, [first, last, company, bio, profilePicture]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("first", first);
    formData.append("last", last);
    formData.append("company", company);
    formData.append("bio", bio);
    file.name
      ? formData.append("profilePicture", file.name)
      : formData.append("profilePicture", profilePicture);
      formData.append("oldProfilePicture", profilePicture);

    try {
      const response = await axios.patch(
        "http://localhost:8000/api/user/" + localStorage.getItem("id"),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      if (response.data.error) {
        setLoading(false);
        setError(response.data.error);
      } else {
        //LYCKAT UPPDATERING
        setLoading(false);
        navigate("/profile");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(profilePicture);
    }
  };

  return (
    <div>
      <form className="registerForm" onSubmit={handleSubmit}>
        <h1>Edit Profile</h1>
        <div className="formDiv">
          <label htmlFor="first">First Name</label>
          <input
            type="text"
            id="first"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
          />
        </div>
        <div className="formDiv">
          <label htmlFor="last">Last Name</label>
          <input
            type="text"
            id="last"
            value={last}
            onChange={(e) => setLast(e.target.value)}
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
          <label htmlFor="bio">Bio</label>
          <textarea
            type="text"
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div className="formDiv">
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            accept="jpg, png, jpeg"
            onChange={handleImageChange}
          />
        </div>
        {error ? (
          <div className="formDiv">
            <p className="warning" aria-live="assertive">
              {error}
            </p>
          </div>
        ) : null}
        <div className="formDiv">
          {loading ? (
            <img className="loading" src={Loading} alt="loading.." />
          ) : (
            <input type="submit" id="submit" value="Update" />
          )}
        </div>
      </form>
    </div>
  );
};
export default EditProfile;
