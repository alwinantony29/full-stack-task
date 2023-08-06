import { Box, Chip, Paper, Typography } from '@mui/material'
import React, { useEffect, } from 'react'
import { useNavigate } from "react-router-dom";
import { axiosInstance } from '../config/axios';
import { toast } from "react-hot-toast";
import { usePDF } from '../store/pdfListContext';
import { useUser } from '../store/UserContext';

const MyPDFs = () => {
    const navigate = useNavigate()
    const [pdfList, setPdfList] = usePDF()
    const { user } = useUser()
    const getMyPDFs = async () => {
        try {
            const response = await axiosInstance.get("/pdf")
            setPdfList(response.data.result)
        } catch (error) {
            console.log(error);
            toast.error("Couldn't get your pdf files")
        }
    }

    const flexCentered = { display: "flex", gap: 1, justifyContent: "center", alignItems: "center", flexWrap: "wrap", }

    useEffect(() => {
        if (user || sessionStorage.getItem("user")) {
            getMyPDFs()
        } else navigate("/login")
    }, [])

    return (
        <div>
            <Paper sx={{ textAlign: "center", p: 1, pb: 5 }}>
                <h1>My PDF's</h1>
                <Box sx={{ ...flexCentered }}>
                    {
                        pdfList.length ? pdfList.map(({ originalName, _id }) => {
                            return (
                                <Chip key={_id} label={originalName} onClick={() => navigate(`/pdf/${_id}`)} clickable />
                            )
                        })
                            :
                            <Typography>Upload a PDF to view & extract it</Typography>
                    }
                </Box>
            </Paper>
        </div>
    )
}

export default MyPDFs