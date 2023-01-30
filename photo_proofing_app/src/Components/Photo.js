import React, { useState } from "react";
import axios from "axios";

const Photo = (props) => {
  const [photoData, setPhotoData] = useState([]);
  const [photo, setPhoto] = useState(props);
  const [like, setLike] = useState(props.data.liked);
  const [save, setSave] = useState(props.saved);
  const [comment, setComment] = useState(props.data.saved.comment);
  const [deleteArray, setDeleteArray] = useState([]);

  const likedPhoto = async (e) => {
    try {
      setLike(!like);
      await fetch("http://localhost:8000/api/photo/" + props.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          like: {
            userId: localStorage.getItem("userID"),
            email: localStorage.getItem("email"),
          },
          liked: !like,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const savePhoto = async (e) => {
    try {
      setSave(!save);
      console.log(save);
      await fetch("http://localhost:8000/api/photo/" + props.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          saved: {
            saved: !save,
            comment: comment,
          },
        }),
      });
    } catch (err) {}
  };

  const storeComment = (e) => {
    setComment(e.target.value);
  };

  const deletePhotos = async () => {
    try {
      await fetch("http://localhost:8000/api/photo/many", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({ ids: deleteArray }),
      });
      setDeleteArray([]);
      //await refetchPhotos();
    } catch (err) {
      console.log(err);
    }
  };

  const photoDeleteArray = () => {
    props.photoCallback(props.id);
  };

  return (
    <>
      <img src={"../../Images/Photos/" + props.name}></img>

      {!props.owner && (
        <>
          <textarea rows={5} onChange={storeComment}>
            {props.data.saved.comment}
          </textarea>
          <a
            class={" " + (like === true ? "like-border" : "")}
            onClick={likedPhoto}
          >
            {" "}
            {like === true ? "Unlike" : "Like"}
          </a>
          <a onClick={savePhoto}>
            {save === false ? "Save comment" : "Save comment"}
          </a>
        </>
      )}
      {props.owner && <a onClick={photoDeleteArray}>Delete</a>}
    </>
  );
};

export default Photo;
