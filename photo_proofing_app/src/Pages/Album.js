//Komponent för specifikt album
import useFetch from "../Components/useFetch";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import EditAlbum from "../Components/EditAlbum";
import AddPhotos from "../Components/AddPhotos";
import ShareAlbum from "../Components/ShareAlbum";
import DeleteIcon from "../Images/delete.svg";
import RemoveIcon from "../Images/remove.svg";

const Album = (props) => {
  const location = useLocation();
  const { sentAlbum } = location.state; //Hämtar album från medskickad state

  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [deleteArray, setDeleteArray] = useState([]);

  const {
    data: photosGet,
    loading: loadingPhotos,
    error: errorPhotos,
    refetch: refetchPhotos,
  } = useFetch(`photo/album/${sentAlbum._id}`);

  const {
    data: albumGet,
    loading: loadingAlbum,
    error: errorAlbum,
    refetch: refetchAlbum,
  } = useFetch(`album/${sentAlbum._id}`);

  const handleShowEdit = () => {
    if (showEdit) {
      setShowEdit(false);
      setShowAdd(false);
      setShowShare(false);
    } else {
      setShowEdit(true);
      setShowAdd(false);
      setShowShare(false);
    }
  };

  const handleShowAdd = () => {
    if (showAdd) {
      setShowAdd(false);
      setShowEdit(false);
      setShowShare(false);
    } else {
      setShowAdd(true);
      setShowEdit(false);
      setShowShare(false);
    }
  };

  const handleShowShare = () => {
    if (showShare) {
      setShowShare(false);
      setShowAdd(false);
      setShowEdit(false);
    } else {
      setShowShare(true);
      setShowAdd(false);
      setShowEdit(false);
    }
  };

  const addRemoveDelete = (e) => {
    //Kolla om klass deletePhoto finns, isåfall ta bort, annars lägg till (toggle), toggla i deleteArray
    if (
      e.target.parentElement.parentElement.classList.contains("deletePhoto")
    ) {
      e.target.parentElement.parentElement.classList.remove("deletePhoto");
      setDeleteArray(
        deleteArray.filter(
          (id) => id !== e.target.parentElement.parentElement.id
        )
      );
      e.target.src = DeleteIcon;
    } else {
      e.target.parentElement.parentElement.classList.add("deletePhoto");
      setDeleteArray([...deleteArray, e.target.parentElement.parentElement.id]);
      e.target.src = RemoveIcon;
    }
  };

  const deletePhotos = async () => {
    try {
      await fetch("http://localhost:8000/api/photo/many", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ids: deleteArray }),
      });
      setDeleteArray([]);
      await refetchPhotos();
    } catch (err) {
      console.log(err);
    }
  };

  if (loadingPhotos) return <p>Loading...</p>;
  if (errorPhotos) {
    console.log(errorPhotos);
    return <p>There was an error fetching photos.. {errorPhotos.message}</p>;
  }

  return (
    <section className="AlbumSection">
      <h1>{sentAlbum.name}</h1>
      <div className="tagsDiv">
        {sentAlbum.tags.map((tag) => {
          return (
            <span className="tag" key={tag}>
              {tag}
            </span>
          );
        })}
      </div>
      <div className="buttonDiv">
        <button
          style={
            showEdit
              ? {
                  background: "#a2b3f7",
                }
              : null
          }
          onClick={handleShowEdit}
        >
          Edit Album
        </button>
        <button
          style={
            showAdd
              ? {
                  background: "#a2b3f7",
                }
              : null
          }
          onClick={handleShowAdd}
        >
          Add Photos
        </button>
        <button
          style={
            showShare
              ? {
                  background: "#a2b3f7",
                }
              : null
          }
          onClick={handleShowShare}
        >
          Share Album
        </button>
      </div>
      {showEdit && (
        <EditAlbum sentAlbum={albumGet} refetchAlbum={refetchAlbum} />
      )}
      {showAdd && (
        <AddPhotos sentAlbum={albumGet} refetchPhotos={refetchPhotos} />
      )}
      {showShare && <ShareAlbum sentAlbum={albumGet} />}
      {deleteArray.length > 0 && (
        <div>
          <h3>Delete {deleteArray.length} images</h3>
          <button onClick={deletePhotos}>Delete Photos</button>
        </div>
      )}
      <div id="collection">
        {photosGet.length === 0 && <h2>No Photos found, Add photos!</h2>}
        {photosGet.map((photo) => {
          return (
            <div className="photoDiv" id={photo._id} key={photo._id}>
              <span onClick={addRemoveDelete}>
                <img src={DeleteIcon} alt="Delete" />
              </span>
              <picture className="photo">
                <img
                  src={"../../Images/Photos/" + photo.name}
                  alt={photo.name}
                />
              </picture>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default Album;
