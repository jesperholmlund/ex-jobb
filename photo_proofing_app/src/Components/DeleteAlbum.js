import { useState } from "react";
import Loading from "../Images/loading.svg";
import { useNavigate } from "react-router-dom";

const DeleteAlbum = ({ sentAlbum }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const deleteAlbum = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/album/" + sentAlbum._id,
        {
          method: "DELETE",
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cover: sentAlbum.cover,
          }),
        }
      );
      setLoading(false);
      setError(false);
      navigate("/Profile"); //Navigera till profile
    } catch (err) {
      setLoading(false);
      setError("Something went wrong..");
    }
  };

  return (
    <div id="deleteAlbumDiv">
      {loading ? (
        <img src={Loading} alt="Loading" />
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <>
          <h3>Delete Album</h3>
          <p>Are you sure you want to delete this album?</p>
          <button onClick={deleteAlbum}>Delete</button>
        </>
      )}
    </div>
  );
};

export default DeleteAlbum;
