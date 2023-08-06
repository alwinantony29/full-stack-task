import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../config/axios';
import { toast } from "react-hot-toast";
import Button from '@mui/material/Button';
// Core viewer
import { Viewer } from '@react-pdf-viewer/core';
// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';
import { useParams } from 'react-router-dom';
import { Box, Checkbox, Chip, Stack } from '@mui/material';

const PDFviewer = () => {
  

  // State to hold the total number of pages 
  const [numPages, setNumPages] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);

  // Creating new plugin instance for  worker viewer
  const pluginInstance = defaultLayoutPlugin({ defaultPageSize: 1, });

  // accessing pdfID from params
  const { pdfID } = useParams()

  useEffect(() => {
    console.log("selected pages useefect : ", selectedPages);
  }, [selectedPages])
  useEffect(() => {
    console.log("useeffect numpage : ", numPages);
  }, [numPages])

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
          <Checkbox checked={selectedPages.includes(page)} onChange={() => handlePageSelect(page)} />
          Page {page}
        </label>
      );
    }
    return checkboxes;
  };
  // 64cd0bc34291d7fdd4a119e8
  const getPDFfromURL = async () => {
    try {
      const response = await axiosInstance.get(`/pdf/${pdfID}`, {
        responseType: 'blob',
      })
      console.log("getPDFfromURL Response  ", response);
      const url = URL.createObjectURL(response.data);
      setPdfUrl(url);
      console.log("pdf url ", url);

    } catch (error) {
      toast.error("Couldn't get that file")
      console.error('Error fetching the PDF:', error);
    }
  }

  const handlePDFextraction = async () => {
    if (!selectedPages.length > 0) {
      return toast.error("Select atleast one page to extract")
    }
    try {
      const response = await axiosInstance.post(`/pdf/${pdfID}`, {
        selectedPages
      }, {
        responseType: 'blob',
      })
      console.log("handlePDFextraction Response  ", response);
      const url = URL.createObjectURL(response.data);
      setPdfUrl(url);
      toast.success("PDF extracted successfully")

    } catch (error) {
      toast.error("Couldn't extract pages")
      console.log(error);
    }

  }

  useEffect(() => {
    getPDFfromURL()
  }, [])

  // {pdfUrl && (<>
  //   <Chip label="Download New PDF" component="a" href={pdfUrl} clickable />
  //   <a href={pdfUrl} download={`kolla.pdf`} target="_blank" rel="noopener noreferrer">
  //     Download PDF
  //   </a>
  // </>
  // )}
  return (<>
    {
      numPages > 1 &&

      <Stack sx={{ alignItems: "center", gap: 3, mt: 3 }}>

        <Button variant="contained" onClick={handlePDFextraction}>Extract selected pages</Button>


        {/* Rendering the checkboxes */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: 'wrap' }}>{renderPageCheckboxes()}</Box>

      </Stack>
    }
    <Box >
      {/* Rendering the PDF  */}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.9.179/build/pdf.worker.min.js">
        {
          pdfUrl &&
          <Viewer
            fileUrl={pdfUrl}
            plugins={[pluginInstance]}
            currentPage={2}
            onDocumentLoad={(e) => { setNumPages(e.doc._pdfInfo.numPages); }}
          />
        }
      </Worker>
    </Box >
  </>

  );
};

export default PDFviewer;
