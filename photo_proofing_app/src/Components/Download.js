import axios from "axios";
import Jszip from "jszip";
import Promise from "bluebird";
import Filesaver from "file-saver";

const Download = (props) => {

  const download = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/photo/download",
        {
          responseType: "blob",
        }
      );
      return response;
    } catch (error) {
    }
  };

  // const downloadByGroup = (urls, files_per_group = 5) => {
  //   return Promise.map(
  //     urls,
  //     async (url) => {
  //       return await download(url);
  //     },
  //     { concurrency: files_per_group }
  //   );
  // };

  // const exportZip = (blobs) => {
  //   const zip = Jszip();
  //   blobs.forEach((blob, i) => {
  //     zip.file(`file-${i}.csv`, blob);
  //   });
  //   zip.generateAsync({ type: "blob" }).then((zipFile) => {
  //     const fileName = Date.now() + ".zip";
  //     return Filesaver.saveAs(zipFile, fileName);
  //   });
  // };

  // const downloadAndZip = (urls) => {
  //   return downloadByGroup(urls, 5).then(exportZip);
  // };

  return (
    <div>
      <button onClick={download}>Download</button>
    </div>
  );
};

export default Download;
