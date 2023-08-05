import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../config/axios';
// Core viewer
import { Viewer } from '@react-pdf-viewer/core';
// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

const PDFviewer = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfFile, setpdfFile] = useState(null);
  // State to hold the total number of pages and selected pages
  const [numPages, setNumPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState([]);
  // Creating new plugin instance for  worker viewer
  const defaultLayoutPluginInstance = defaultLayoutPlugin();


  useEffect(() => {
    console.log(numPages);
  }, [numPages])
  useEffect(() => {
    console.log(pdfFile);
  }, [pdfFile])
  // Function to handle checkbox selection
  const handlePageSelect = (page) => {
    if (selectedPages.includes(page)) {
      setSelectedPages(selectedPages.filter((p) => p !== page));
    } else {
      setSelectedPages([...selectedPages, page]);
    }
  };
  // Function to render checkboxes for each page
  const renderPageCheckboxes = () => {
    const checkboxes = [];
    for (let page = 1; page <= numPages; page++) {
      checkboxes.push(
        <label key={page}>
          <input
            type="checkbox"
            checked={selectedPages.includes(page)}
            onChange={() => handlePageSelect(page)}
          />
          Page {page}
        </label>
      );
    }
    return checkboxes;
  };

  const getPDFfromURL = async () => {
    try {
      const response = await axiosInstance.get(`/pdf/64cd0bc34291d7fdd4a119e8`, {
        responseType: 'blob',
      })
      console.log("Response from server ", response);
      setpdfFile(response.data)
      const url = URL.createObjectURL(response.data);
      setPdfUrl(url);
      console.log("pdf url ", url);

    } catch (error) {
      console.error('Error fetching the PDF:', error);
    }
  };
  useEffect(() => {
    // getPDFfromURL()
  }, [])

  return (
    <div>
      <button onClick={getPDFfromURL}>click me</button>
      {pdfUrl && (
        <a href={pdfUrl} download={`kolla.pdf`} target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>
      )}

      <div>
        {/* Render the checkboxes */}
        {renderPageCheckboxes()}

        {/* Render the PDF  */}
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.9.179/build/pdf.worker.min.js">
          {pdfUrl &&
            <Viewer
              fileUrl={pdfUrl}
              // Register plugins
              plugins={[defaultLayoutPluginInstance]}
            />
          }
        </Worker>
      </div>

    </div>
  );
};

export default PDFviewer;
