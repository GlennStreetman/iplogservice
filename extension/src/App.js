import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import './App.css';
import {BiCopy} from 'react-icons/bi';
import {AiOutlineCheckCircle} from 'react-icons/ai'

import MapParams from '../components/MapParams'

import postIP from '../lib/postIP'

function App() {

    const [userId, setUserId] = useState('')
    const [hook, setHook] = useState('')
    const [myIP, setMyIP] = useState('')
    const [newIP, setNewIP] = useState(false)
    const [params, setParams] = useState()
    const [newParam, setNewParam] = useState('')
    const [msg, setMsg] = useState()

    function addNewParam(){
        const newParamsArray = {...params, [newParam]: ''}
        setNewParam('')
        setParams(newParamsArray)
    }

    function logIP(){
        if (myIP && hook){
            console.log('attempting to log ip')
            const todayDate = new Date().toISOString().slice(0, 10)
            const data = {
                ip: myIP,
                userid: userId,
                date: todayDate,
            }
            if (params) data['meta'] = params
            postIP(hook, data, setMsg)
        }
    }

    useEffect(()=>{
        chrome.storage.sync.get(["userId"]).then((result) => {
            if(result.userId)setUserId(result['userId'])
        });
        
        chrome.storage.sync.get(["hook"]).then((result) => {
            if(result['hook'])setHook(result['hook'])
        });
        
        chrome.storage.sync.get(["params"]).then((result) => {
            const stringParams = result['params']
            const convertParams = stringParams ? JSON.parse(stringParams) : false
            setParams(convertParams)
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
            })
            .catch((error)=>{
                console.log('Error retrieving API from https://api.ipify.org?format=json', error)
                setMsg('Unable to retrieve Public IP from api.ipify.org')
            })
        });
    },[])

    useEffect(()=>{
        chrome.storage.sync.set({"userId": userId})
    },[userId])

    useEffect(()=>{
        chrome.storage.sync.set({"hook": hook})
    },[hook])

    useEffect(()=>{
        const paramString = params ? JSON.stringify(params) : false
            if (paramString) chrome.storage.sync.set({"params": paramString})
    },[params])

    useEffect(()=>{
        if (newIP === true){
            setNewIP(false)
            logIP()
        }
    },[newIP])

    return (
        <div className="App">
            <header className="Chrome IP Hook" />
            <Box sx={{height: "25px"}} />
            <Box sx={{fontSize: "2rem", marginBottom: "16px"}}>
                IP.SPY
            </Box>
            <Box sx={{padding: "2px", display: "flex", gap: "16px", flexDirection: "column"}} component="span">
                <TextField value={hook} onChange={(e)=>setHook(e.target.value)} id="outlined-basic" label="Webhook" variant="outlined" />
                <TextField value={userId} onChange={(e)=>setUserId(e.target.value)} id="outlined-basic" label="UserId/Email" variant="outlined" />
                <MapParams params={params} setParams={setParams} />
                <Button onClick={()=>{navigator.clipboard.writeText(myIP)}} variant="contained" sx={{ width: '100%', margin: "auto" }} className="icons">
                    Public IP: {myIP}  <BiCopy  />
                </Button>
                <Button sx={{ width: '100%', margin: "auto" }} variant="contained" onClick={(logIP)}>Log IP Address</Button>
                <Box sx={{display: "flex", fontSize: "2rem" }} className="icons">
                    <TextField value={newParam} onChange={(e)=>setNewParam(e.target.value)} sx={{ width: '80%'}} id="outlined-basic" label="New Query Parameter" variant="outlined" />
                    <Button sx={{display: "flex", fontSize: "2rem" }} onClick={addNewParam}>
                        <AiOutlineCheckCircle />
                    </Button>
                </Box>
            </Box>
            <Box sx={{marginTop: "8px"}}>
                {msg}
            </Box>
    
        </div>
    );
}

export default App;