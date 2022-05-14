import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import LoadingSVG from "../Images/loading.svg";
import MyAlbums from "../Components/ProfileAlbums";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  //fetch för att hämta profilen
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/user/" + localStorage.getItem("id"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );
      const json = await response.json();
      console.log("json:", json);
      const transformedProfile = {
        name: {
          first: json.name.first,
          last: json.name.last,
        },
        email: json.email,
        company: json.company,
        profilePicture: json.profilePicture,
        bio: json.bio,
        role: json.role,
        albums: json.albums,
        invites: json.invites,
        id: json._id,
      };
      setProfile(transformedProfile);
      setIsLoading(false);
      return transformedProfile;
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
      setIsLoading(false);
    }
  }, []);
  //Kör fetchProfile när sidan laddas
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <>
      {isLoading ? (
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
                src={"../Images/ProfileImages/" + profile.profilePicture}
                alt="ProfileImage"
              />
            </div>
            <h1>{profile.company}</h1>
            {profile.bio ? <p className="bio">{profile.bio}</p> : null}
            <p className="role">{profile.role}</p>
            <Link
              to={`/profile/edit/${profile.id}`}
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
          {profile.role === "Photographer" && <MyAlbums />}
        </>
      )}
    </>
  );
};

export default Profile;
