import React, { useState } from 'react'
import FileUploadForm from '../components/FileUploadForm'
import MyPDFs from '../components/MyPDFs'
import { Stack } from '@mui/material'
import PdfProvider from '../store/pdfListContext'

const Home = () => {

  return (
    <PdfProvider>

      <Stack gap={2}>

        <FileUploadForm />

        <MyPDFs />

      </Stack>

    </PdfProvider>
  )
}

export default Home