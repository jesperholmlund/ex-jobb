//Komponent för atteditera specifikt album
import { useState, useEffect } from "react";
import Loading from "../Images/loading.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditAlbum = (props) => {
  const [name, setName] = useState(props.sentAlbum.name);
  const [description, setDescription] = useState(props.sentAlbum.description);
  const [cover, setCover] = useState(props.sentAlbum.cover);
  const [tags, setTags] = useState(props.sentAlbum.tags);
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [name, description, cover, tags]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("cover", cover);
    formData.append("file", file);
    formData.append("oldCover", props.sentAlbum.cover);

    try {
      const response = await axios.patch(
        "http://localhost:8000/api/album/" + props.sentAlbum._id,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      //LYCKAT UPPDATERING
      setLoading(false);
      navigate("/Profile"); //Navigera till profile
    } catch (err) {
      setLoading(false);
      setError("Something went wrong..");
    }
  };

  const handleCoverChange = (e) => {
    //Hämtar filen som användaren valt
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setCover(Date.now() + "_" + e.target.files[0].name);
    } else {
      setFile(null);
      setCover(props.sentAlbum.cover);
    }
  };

  if (loading) {
    return (
      <div>
        <img className="loading" src={Loading} alt="loading.." />
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Album</h2>
      <div className="formDiv">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="formDiv">
        <label htmlFor="description">Description</label>
        <textarea
          type="text"
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="formDiv">
        <label htmlFor="cover">Cover</label>
        <input
          type="file"
          name="cover"
          id="cover"
          onChange={handleCoverChange}
        />
      </div>
      <div className="formDiv">
        <label>Tags(Separate with ",")</label>
        <input
          type="text"
          name="tags"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div className="formDiv">
        <input type="submit" value="Update Album" />
      </div>
      {error && <p>{error}</p>}
    </form>
  );
};
export default EditAlbum;
