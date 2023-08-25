import React, { useState } from "react";
import axios from "axios";
import Header from "../component/Header";
import { FcVideoFile } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function FileUploader() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  // copy link
  const notify = () => toast("Copied to Clipboard!");

  const warning = () => {
    if (file) {
      toast.success("File Uploaded!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.warn("Upload file!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const copyToClipboard = () => {
    const el = document.createElement("textarea");
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    notify();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileInputChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", text);
    console.log(text);

    try {
      const response = await axios.post(
        "https://rocket-share.onrender.com/upload",
        formData,
        {
          // https://rocket-share.onrender.com/upload
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.path);
      console.log(response.data);
      setLink(response.data.path);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="h-screen bg-[#EFF5FE]  ">
        <Header />
        <div className=" flex flex-col justify-center p-5 mt-10 bg-white rounded-md mx-60 py-10 shadow-2xl ">
          <div className="flex flex-col  text-center mx-10   border-dashed border-cyan-950 border-2 h-96  rounded-md ">
            <form onSubmit={handleSubmit} className="mt-10">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="flex flex-col items-center justify-center"
              >
                <FcVideoFile
                  onClick={(e) => {
                    document.getElementById("file-upload").click();
                  }}
                  size={100}
                />
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                <label
                  htmlFor="file-upload"
                  className="mt-10 cursor-pointer text-blue-700 underline  text-2xl font-semibold"
                >
                  {file ? file.name : "Drop Your File or, Browse"}
                </label>
              </div>
              <div>
                <label className="text-xl font-bold">Password: </label>
                <input
                  className=" mt-10 bg-white-300 rounded-md  text-black  border-2 border-black my-2  py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent  "
                  placeholder="Enter Password"
                  type="password"
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                type="submit"
                disabled={!file}
              >
                Get Link
              </button>
            </form>
          </div>

          <div className=" flex flex-col text-center justify-center ">
            <h1 className="text-xl font-medium ">Download Link: </h1>
            <a className="text-blue-700 underline text-xl mt-2" href={link}>
              {link}
            </a>
            <div className="mt-4">
              {link && (
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 "
                  onClick={copyToClipboard}
                >
                  copy link
                </button>
              )}
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FileUploader;
