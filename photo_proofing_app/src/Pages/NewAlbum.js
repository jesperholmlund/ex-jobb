import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Images/loading.svg";
import axios from "axios";
import TitleRename from "../utility/TitleRename";

const NewAlbum = () => {
  TitleRename("Photo Proof - New Album");

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("");
  const [tags, setTags] = useState([]);

  const [file, setFile] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError("");
  }, [name, description, cover, tags]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("cover", cover);
    formData.append("tags", tags);
    formData.append("owner", localStorage.getItem("id"));
    try {
      const response = await axios.post(
        "http://localhost:8000/api/album",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      if (response.error) {
        setLoading(false);
        setError(response.data.error);
      } else {
        //LYCKADES REGISTRERA
        setLoading(false);
        navigate("/profile");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const handleCoverChange = (e) => {
    //Hämtar filen som användaren valt
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setCover(Date.now() + "_" + e.target.files[0].name);
    } else {
      setFile("");
      setCover("");
    }
  };

  return (
    <>
      {loading === true && (
        <div className="loading">
          <img src={Loading} alt="loading" />
        </div>
      )}
      {loading === false && (
        <>
          <h1>Create New Album</h1>
          <form onSubmit={handleSubmit}>
            <div className="formDiv">
              <label htmlFor="name">Album Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="formDiv">
              <label htmlFor="description">Album Description</label>
              <textarea
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="formDiv">
              <label htmlFor="cover">Album Cover</label>
              <input
                type="file"
                id="cover"
                accept="jpg, png, jpeg, gif"
                onChange={handleCoverChange}
              />
            </div>
            <div className="formDiv">
              <label>Tags(Separate with ",")</label>
              <input
                type="text"
                onChange={(e) => setTags(e.target.value)}
                value={tags}
              />
            </div>
            <div className="formDiv">
              <input type="submit" value="Create Album" />
            </div>
            {error ? (
              <div className="formDiv">
                <p className="warning" aria-live="assertive">
                  {error}
                </p>
              </div>
            ) : null}
          </form>
        </>
      )}
    </>
  );
};

export default NewAlbum;
