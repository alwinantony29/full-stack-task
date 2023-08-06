import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { updateToken } from '../../config/axios';
import { toast } from 'react-hot-toast';
import { useUser } from "../../store/UserContext";
export default function NavBar() {
    const { user, setUser } = useUser()
    

    useEffect(() => {
        setUser(JSON.parse(sessionStorage.getItem("user")))
    }, [])

    const handleLogout = () => {
        signOut(auth).then(() => {
            updateToken(null)
            setUser(null)
            sessionStorage.clear()
            toast.success("Logout successfull")
        }).catch((error) => {
            toast.error("Couldn't logout try again")
            console.log(error);
        })
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        PDF Extractor
                    </Typography>

                    {
                        user &&
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>

                    }

                </Toolbar>
            </AppBar>
        </Box>
    );
}
