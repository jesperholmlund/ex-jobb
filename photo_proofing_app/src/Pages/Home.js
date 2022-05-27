import TitleRename from "../utility/TitleRename";

const Home = () => {
  TitleRename("Photo Proof - Home");
  //Home Page
  return (
    <div id="homeDiv">
      <h1>Start Photo-Proofing now!</h1>
      <div>
        <h2>Photographer</h2>
        <ul>
          <li>Make a photographer account</li>
          <li>Create Albums</li>
          <li>Add Images to show watermarked or not!</li>
          <li>Share the album for customers to view!</li>
          <li>See which images the customer liked and comments!</li>
          <li>Send images and enable ZIP-download when customer has paid!</li>
        </ul>
      </div>
      <div>
        <h2>Customer</h2>
        <ul>
          <li>Make a customer account</li>
          <li>See if a photographer shared an album</li>
          <li>View all the images</li>
          <li>Like images and send comments!</li>
          <li>Download images sent by photographer when enabled!</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
