//Komponent för teckande popup ruta för vissa notifikationer
const PopUpMessage = (props) => {
  return (
    <div className="fullSizeDiv">
      <div className="popUpDiv">
        <h2>props.title</h2>
        <p>props.message</p>
        <button>Close</button>
      </div>
    </div>
  );
};

export default PopUpMessage;
