import React, { useState } from 'react';
import axios from 'axios';


function FileUploader() {
  const [file, setFile] = useState(null);
  const [text,setText] = useState('');
  const [link,setLink] = useState('');
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
    formData.append('file', file);
    formData.append('text',text);
    console.log(text);
    
    try {
        const response = await axios.post('https://rocket-share.onrender.com/upload', formData, {
          // https://fileshare-link.onrender.com/upload
          // https://rocket-share.onrender.com/upload
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data.path);
        console.log(response.data)
        setLink(response.data.path);
      } catch (err) {
        console.error(err);
      }
  };

  return (
    <>
    <div className='m-10'>
      <h1 className='w-full text-center font-bold text-3xl mb-5 text-slate-600'>File Share Link!!</h1>
    <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center'>
      <div
        className="border-2 border-dashed border-gray-400 p-4 rounded-md flex flex-col items-center justify-center w-full h-64"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          {file ? file.name : "Drag and drop a file or click to choose a file"}
        </label>
      </div>
      <div>
      <label>Password: </label>
      <input type='password' className='my-10 border-2 border-black rounded-sm text-lg' onChange={(e)=>{
                  setText(e.target.value);
      }}/> 
      </div>
      <button
        type="submit"
        className="mt-4 px-8 py-3 text-sm font-medium text-white bg-green-500 rounded-md cursor-pointer hover:bg-green-600 focus:bg-green-600"
        disabled={!file}
      >
        Uplaod
      </button>
    </form>
    <h1 className='font-bold text-xl'>Download Link: </h1>
    <a href={link} className='underline text-lg text-blue-600'>{link}</a>
    </div>
    </>
  );
}

export default FileUploader;
