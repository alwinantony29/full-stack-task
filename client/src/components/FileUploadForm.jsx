import { useState } from 'react';
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { usePDF } from '../store/pdfListContext';

const FileUploadForm = () => {
    const [pdfList, setPdfList] = usePDF()
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null)

    //handles file input
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const allowedExtensions = /(\.pdf)$/i;

        if (file && allowedExtensions.test(file.name)) {
            setSelectedFile(file);
            setError(null);
        } else {
            setSelectedFile(null);
            setError('Please select a valid PDF file.');
        }
    }

    const handleSubmit = async (event) => {

        console.log("submitting");
        event.preventDefault();

        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('pdfFile', selectedFile);
                const result = await axiosInstance.post("/pdf", formData)
                console.log(result.data.file);
                setPdfList(prev => [...prev, result.data.file])
                toast.success(result.data.message)
            } catch (error) {
                console.log(error);
                toast.error(error.response.data.message)
            }
        } else {
            setError('Please select a valid PDF file before submitting.');
        }
    }

    return (
        <Paper>
            <Stack sx={{ alignItems: "center", gap: 3, height: "20vh", justifyContent: "center" }}>
                <form onSubmit={handleSubmit}>

                    <Box sx={{ display: { xs: "grid", sm: "flex", }, flexWrap: 'wrap', justifyContent: "center", alignItems: "center", gap: 2 }}>
                        <Button type="submit" variant="contained" disabled={!selectedFile}>
                            Upload PDF
                        </Button>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                        />
                    </Box>
                    <div>
                    </div>
                </form>
                {error && <Typography color='red'>{error}</Typography>}
            </Stack>
        </Paper>
    );
};
export default FileUploadForm;