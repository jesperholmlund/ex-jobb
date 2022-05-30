import { Link } from "react-router-dom";
import LoadingSVG from "../Images/loading.svg";
import anonProfilePicture from "../Images/anon.svg";
import MyAlbums from "../Components/ProfileAlbums";
import MyInvites from "../Components/ProfileInvites";
import useFetch from "../Components/useFetch";
import TitleRename from "../utility/TitleRename";

const Profile = () => {
  TitleRename("Photo Proof - Profile");

  const {
    data: profile,
    loading,
    error,
  } = useFetch(`user/${localStorage.getItem("id")}`);
  console.log(profile);

  return (
    <section id="profileAlbumsSection">
      {loading ? (
        <div className="loading">
          <img src={LoadingSVG} alt="loading" />
        </div>
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <>
          <div className="profileInfo">
            <div className="profilePicture">
              <img
                src={
                  profile.profilePicture === null ||
                  profile.profilePicture === "" ||
                  profile.profilePicture === "anon.svg"
                    ? anonProfilePicture
                    : "../Images/ProfileImages/" + profile.profilePicture
                }
                alt="ProfileImage"
              />
            </div>
            <h1>{profile.company}</h1>
            {profile.bio ? <p className="bio">{profile.bio}</p> : null}
            <p className="role">{profile.role}</p>
            <Link
              to={`/profile/edit/${profile._id}`}
              state={{
                first: profile.name.first,
                last: profile.name.last,
                company: profile.company,
                profilePicture: profile.profilePicture,
                bio: profile.bio,
              }}
            >
              Edit Profile
            </Link>
          </div>
          {profile.role === "Photographer" && <MyAlbums role="Photographer" />}
          {profile.role === "Customer" && <MyInvites role="Customer" />}
        </>
      )}
    </section>
  );
};

export default Profile;
