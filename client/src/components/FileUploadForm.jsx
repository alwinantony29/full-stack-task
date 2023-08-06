import { useState } from 'react';
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import { Box, Button, Paper, Stack, } from '@mui/material';
import { usePDF } from '../store/pdfListContext';

const FileUploadForm = () => {
    const [pdfList, setPdfList] = usePDF()
    const [selectedFile, setSelectedFile] = useState(null);

    //handles file input
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const allowedExtensions = /(\.pdf)$/i;

        if (file && allowedExtensions.test(file.name)) {
            setSelectedFile(file);
        } else {
            toast.error("Please select a valid PDF file")
            setSelectedFile(null);
        }
    }

    const handleSubmit = async (event) => {

        event.preventDefault();
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('pdfFile', selectedFile);
                const result = await axiosInstance.post("/pdf", formData)
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
            <Stack sx={{ alignItems: "center", gap: 3, height: "25vh", justifyContent: "center" }}>
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
            </Stack>
        </Paper>
    );
};
export default FileUploadForm;