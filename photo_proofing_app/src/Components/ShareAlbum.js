import { useState, useEffect } from "react";
import useFetch from "./useFetch";

//handleShowDetails döljer showEdit, showAdd, showShare och visar showDetails i parent-komponenten
const ShareAlbum = ({ sentAlbum, refetchAlbum, handleShowDetails }) => {
  const [email, setEmail] = useState("");
  const [watermarked, setWatermarked] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState(sentAlbum);
  const [shared, setShared] = useState("");

  const {
    data,
    loading: loadingData,
    error: errorData,
    refetch: refetchData,
  } = useFetch(`http://localhost:8000/api/album/${sentAlbum._id}`);

  useEffect(() => {
    setError("");
  }, [email, watermarked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      //Kontrollera att email ej är tomt, att email innehåller @ och .
      if (email === "" || !email.includes("@" || !email.includes("."))) {
        setError("Please enter a valid email");
        setLoading(false);
        return;
      }
      //Loopar igenom array med invites. Kontrollerar om email finns i arrayen.
      for (let i = 0; i < data.invites.length; i++) {
        if (data.invites[i].email === email) {
          setError("This email is already invited");
          setLoading(false);
          return;
        }
      }
      //Anrop för share album
      await fetch("http://localhost:8000/api/album/" + album._id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          addEmail: {
            email: email,
            watermarked: watermarked,
          },
        }),
      });
      //Lyckat anrop
      setLoading(false);
      setError("");
      setEmail("");
      setWatermarked("");
      refetchData();
      setShared(data);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const removeShare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await fetch("http://localhost:8000/api/album/" + album._id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          removeEmail: {
            email: e.target.parentElement.parentElement.children[0].innerText,
          },
        }),
      });

      //Lyckat anrop
      setLoading(false);
      setError("");
      refetchData();
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const toggleWatermark = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await fetch("http://localhost:8000/api/album/" + album._id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          toggleWatermark: {
            email: e.target.parentElement.parentElement.children[0].innerText,
          },
        }),
      });

      //Lyckat anrop
      setLoading(false);
      setError("");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Share Album</h2>
        <div className="formDiv">
          <label htmlFor="email">Email * {error && <p>{error}</p>}</label>

          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="formDiv">
          <label htmlFor="watermark">Use Watermark</label>
          <div className="radioDiv">
            <input
              type="radio"
              name="watermark"
              value="true"
              onChange={(e) => {
                setWatermarked(e.target.value);
              }}
              defaultChecked
            />
            <span>Yes</span>
          </div>
          <div className="radioDiv">
            <input
              type="radio"
              name="watermark"
              value="false"
              onChange={(e) => {
                setWatermarked(e.target.value);
              }}
            />
            <span>No</span>
          </div>
        </div>

        <div className="formDiv">
          <input type="submit" value="Share with Email" />
        </div>
      </form>
      {data && data.invites.length > 0 && (
        <div className="invitesDiv">
          <h2>Shared</h2>
          {data.invites.map((invite) => {
            return (
              <div id={invite._id} key={invite._id}>
                <p>{invite.email}</p>
                <p>Watermarked: {invite.watermarked ? "Yes" : "No"}</p>
                <p>
                  Ready: {invite.done ? "Yes, " : "No"}{" "}
                  {invite.done && (
                    <span
                      id={invite.email}
                      onClick={(e) => {
                        localStorage.setItem("detailsEmail", e.target.id);
                        handleShowDetails();
                      }}
                      className="link"
                    >
                      Details
                    </span>
                  )}
                </p>
                <div className="watermarkButtons">
                  <button onClick={removeShare}>Remove Share</button>
                  <button onClick={toggleWatermark}>Toggle WM</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ShareAlbum;
