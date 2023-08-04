import { useState } from 'react';
import { axiosInstance } from "../config/axios";
const FileUploadForm = () => {

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
    const handleSubmit = (event) => {
        console.log("submitting");
        event.preventDefault();

        if (selectedFile) {
            console.log();
            const formData = new FormData();
            formData.append('pdfFile', selectedFile);
            axiosInstance.post("/pdf",formData)
        } else {
            setError('Please select a valid PDF file before submitting.');
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <div>
                    <button type="submit" disabled={!selectedFile}>
                        Upload PDF
                    </button>
                </div>
            </form>
        </div>
    );
};
export default FileUploadForm;