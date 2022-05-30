import useFetch from "../Components/useFetch";
import LoadingSVG from "../Images/loading.svg";
import { Link } from "react-router-dom";

const ProfileInvites = ({ role }) => {
  const {
    data: album,
    loading,
    error,
  } = useFetch(`album/email/${localStorage.getItem("email")}`);
  return (
    <>
      {loading && (
        <div className="loading">
          <img src={LoadingSVG} alt="loading" />
        </div>
      )}
      {error && <h1>{error}</h1>}
      {album && (
        <div id="albums">
          {album.map((album) => (
            <div key={album._id}>
              <Link
                to={"/Profile/Album/" + album._id}
                state={{
                  sentAlbum: album,
                  role: role,
                }}
                key={album._id}
              >
                <div className="album">
                  <picture>
                    <img
                      src={"../Images/AlbumCovers/" + album.cover}
                      alt={album.name}
                    />
                  </picture>
                  <h3>{album.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProfileInvites;
