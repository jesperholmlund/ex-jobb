import { useState, useEffect } from "react";

const ShareAlbum = () => {
  const [email, setEmail] = useState("");
  const [watermarked, setWatermarked] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form>
      <h2>Share Album</h2>
      <div className="formDiv">
        <label htmlFor="email">Email *</label>
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
            onChange={(e) => setWatermarked(e.target.value)}
            checked
          />
          <span>Yes</span>
        </div>
        <div className="radioDiv">
          <input
            type="radio"
            name="watermark"
            value="false"
            onChange={(e) => setWatermarked(e.target.value)}
          />
          <span>No</span>
        </div>
      </div>

      <div className="formDiv">
        <input type="submit" value="Share with Email" />
      </div>
    </form>
  );
};

export default ShareAlbum;
