//Komponent för att lägga till bilder i ett specifikt album genom patch av album
import { useState, useEffect, useRef } from "react";
import Drop from "../Images/drop.svg";
import Remove from "../Images/remove.svg";
import ProgressBar from "./ProgressBar";
import axios from "axios";

const AddPhotos = (props) => {
  const [files, setFiles] = useState("");
  const [fileNames, setFileNames] = useState("");
  const [preview, setPreview] = useState([]);

  const [loading, setLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");

  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragOverDropzone, setIsDragOverDropzone] = useState(false);

  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    setError("");
  }, [files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files) {
      setLoading(true);
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
        formData.append("fileName", fileNames[i]);
        formData.append("watermarked", "wm_" + fileNames[i]);
        formData.append("album", props.sentAlbum._id);
        formData.append("owner", props.sentAlbum.owner);
      }
      try {
        await axios.post("http://localhost:8000/api/photo/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
          onUploadProgress: (progressEvent) => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );
          },
        });
        //LYCKADES REGISTRERA
        setUploadMessage("Uploaded Successfully");
        await props.refetchPhotos();
      } catch (err) {
        setError(err.response);
        setUploadMessage("Error Uploading", err.response);
      } finally {
        setUploadPercentage(0);
        setLoading(false);
        setPreview(null);
        setFiles(null);
      }
    }
  };

  const handlePhotosChange = (e) => {
    //Hämtar eller nollställer state för filer vid ändring av inputets värde
    if (e.target.files[0]) {
      const newPhotos = [];
      const newFiles = [];
      const newPreview = [];
      //Hämtar filerna från input
      for (let i = 0; i < e.target.files.length; i++) {
        //Kontrollerar om filen är en bild
        if (e.target.files[i].type.substr(0, 5) === "image") {
          //Lägger till fil och filnamn i variabler
          newFiles.push(e.target.files[i]);
          newPhotos.push(Date.now() + "_" + e.target.files[i].name);
          newPreview.push(URL.createObjectURL(e.target.files[i]));
        }
      }
      //Lägg till variablerna i state
      setFiles(newFiles);
      setFileNames(newPhotos);
      setPreview(newPreview);
      setUploadMessage("");
    } else {
      setFiles(null);
      setFileNames(null);
      setPreview(null);
      setUploadMessage("");
    }
  };
  const onDragStyle = {
    background: isDragOverDropzone ? "lightgreen" : "white",
  };
  const handleOnDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
    setIsDragOverDropzone(true);
  };
  const handleOnDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
    setIsDragOverDropzone(true);
  };
  const handleOnDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
    setIsDragOverDropzone(false);
  };
  const handleOnDragEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragOverDropzone(false);
  };
  const handleOnDragDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragOverDropzone(false);

    //Hämtar eller nollställer state för filer vid ändring av inputets värde
    if (e.dataTransfer.files) {
      const newPhotos = [];
      const newFiles = [];
      const newPreview = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        //Kontrollerar om filen är en bild
        if (e.dataTransfer.files[i].type.substr(0, 5) === "image") {
          newFiles.push(e.dataTransfer.files[i]);
          newPhotos.push(Date.now() + "_" + e.dataTransfer.files[i].name);
          newPreview.push(URL.createObjectURL(e.dataTransfer.files[i]));
        }
      }
      setFiles(newFiles);
      setFileNames(newPhotos);
      setPreview(newPreview);
      setUploadMessage("");
    } else {
      setFiles(null);
      setFileNames(null);
      setPreview(null);
      setUploadMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload Photos</h2>
      <div className="formDiv">
        <div id="dragAndDropDiv">
          <div
            id="dropZone"
            onDragOver={handleOnDragOver}
            onDragEnter={handleOnDragEnter}
            onDragLeave={handleOnDragLeave}
            onDragEnd={handleOnDragEnd}
            onDrop={handleOnDragDrop}
            onClick={() => fileInputRef.current.click()}
            style={onDragStyle}
          >
            <img src={Drop} alt="Drop Icon" />
            <h3>Drag & Drop</h3>
            <p>(or click and choose)</p>
          </div>
        </div>
        <input
          id="addPhotosInput"
          type="file"
          name="photos"
          multiple
          onChange={handlePhotosChange}
          accept="jpg, jpeg, png, gif, tiff, bmp, avif"
          ref={fileInputRef}
        />
        {preview && (
          <div id="previewDiv">
            {preview.map((image, key) => (
              <div
                key={key}
                onClick={() => {
                  setPreview(preview.filter((e) => e !== image));
                  setFiles(files.filter((e) => e !== files[key]));
                  setFileNames(fileNames.filter((e) => e !== fileNames[key]));
                  if (files.length === 1) {
                    setPreview(null);
                    setFiles(null);
                    setFileNames(null);
                  }
                }}
              >
                <img className="previewImg" src={image} alt="Preview" />
                <img className="previewRemove" src={Remove} alt="Remove Icon" />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="formDiv">
        {files && (
          <>
            <h4>{files.length} Files Choosen</h4>
            <p>Allowed: jpg, png, tiff, gif, bmp</p>
            <input type="submit" value="Upload Images" />
          </>
        )}
      </div>
      {loading && <ProgressBar percentage={uploadPercentage} />}
      {uploadMessage && <p>{uploadMessage}</p>}
    </form>
  );
};

export default AddPhotos;
