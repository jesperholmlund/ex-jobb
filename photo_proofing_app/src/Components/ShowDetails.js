const ShowDetails = ({ sentAlbum, photosGet }) => {
  let photosArray = [];
  return (
    <>
      {sentAlbum.invites.map((invite) => {
        if (invite.email === localStorage.getItem("detailsEmail")) {
          return (
            <div class="detailsDiv" id={invite._id} key={invite._id}>
              <h2>Sharing Details</h2>
              <p>{invite.email}</p>
              <p>Watermarked: {invite.watermarked ? "Yes" : "No"}</p>
              <div class="commentDiv">
                <h3>Comment</h3>
                <p>{invite.comment}</p>
              </div>
              {photosGet.forEach((photo) => {
                if (photo.likes) {
                  for (let i = 0; i < photo.likes.length; i++) {
                    if (
                      photo.likes[i].email ===
                      localStorage.getItem("detailsEmail")
                    ) {
                      photosArray.push(photo.name);
                    }
                  }
                }
              })}
              {photosArray.length > 0 && (
                <div class="likedImagesDiv">
                  <h3>Liked Photos</h3>
                  {photosArray.map((photo) => {
                    return <p key={photo}>{photo.substring(14)}</p>;
                  })}
                </div>
              )}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default ShowDetails;
