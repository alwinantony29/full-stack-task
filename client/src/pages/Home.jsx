import React, { useState } from 'react'
import FileUploadForm from '../components/FileUploadForm'
import MyPDFs from '../components/MyPDFs'
import { Stack } from '@mui/material'
import PdfProvider from '../store/pdfListContext'

const Home = () => {
  const [pdfList, setPdfList] = useState([])

  return (
    <PdfProvider>

      <Stack gap={2}>

        <FileUploadForm setPdfList={setPdfList} />

        <MyPDFs setPdfList={setPdfList} pdfList={pdfList} />


      </Stack>

    </PdfProvider>
  )
}

export default Home