import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import './App.css';
import {BiCopy} from 'react-icons/bi';


function App() {

    const [userId, setUserId] = useState('')
    const [hook, setHook] = useState('')
    const [myIP, setMyIP] = useState('')
    const [newIP, setNewIP] = useState(false)

    function handleUserId(e){
        setUserId(e.target.value)
    }

    function handleSetHook(e){
        setHook(e.target.value)
    }

    useEffect(()=>{
        chrome.storage.sync.get(["userId"]).then((result) => {
            if(result.userId)setUserId(result.userId)
        });
        
        chrome.storage.sync.get(["hook"]).then((result) => {
            if(result.hook)setHook(result.hook)
        });

        chrome.storage.sync.get(["myIP"]).then((result) => {
            
            if(result.myIP)setMyIP(result.myIP)
            
            fetch("https://api.ipify.org?format=json")
            .then((response) => response.json())
            .then((data) => {
                if(result.myIP !== data.ip) {
                    setMyIP(data.ip)
                    setNewIP(true)
                }
            });

        });

    },[])

    useEffect(()=>{
        chrome.storage.sync.set({"userId": userId})
    },[userId])

    useEffect(()=>{
        chrome.storage.sync.set({"hook": hook})
    },[hook])

    useEffect(()=>{
        if (newIP === true){
            setNewIP(false)
            if (hook){
                const todayDate = new Date().toISOString().slice(0, 10)
                chrome.storage.sync.set({"myIP": myIP})
                fetch(`${hook}?ip=${myIP}&userid=${userId}&date=${todayDate}`, {method: 'GET', mode: 'no-cors'})
            }
        }
    },[newIP])

    function logIP(){
        const todayDate = new Date().toISOString().slice(0, 10)
        fetch(`${hook}?ip=${myIP}&userid=${userId}&date=${todayDate}`, {method: 'GET', mode: 'no-cors'})
    }

    return (
        <div className="App">
            <header className="Chrome IP Hook" />
            <Box sx={{height: "25px"}} />
            <Box sx={{fontSize: "2rem", marginBottom: "16px"}}>
                My IP Hook
            </Box>
            <Box sx={{padding: "2px", display: "flex", gap: "16px", flexDirection: "column"}} component="span">
                <TextField value={userId} onChange={handleUserId} id="outlined-basic" label="UserId/Email" variant="outlined" />
                <TextField value={hook} onChange={handleSetHook} id="outlined-basic" label="Webhook" variant="outlined" />
            </Box>
            <Box sx={{fontSize: "2rem"}}>
                {myIP}
                <BiCopy className="icons" onClick={()=>{navigator.clipboard.writeText(myIP)}} />
            </Box>
            <Stack spacing={2} direction="row">
                <Button variant="text" onClick={(logIP)}>LogIP</Button>
            </Stack>
        </div>
    );
}

export default App;
