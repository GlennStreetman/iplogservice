import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import './App.css';
import {BiCopy} from 'react-icons/bi';
import {AiOutlineCheckCircle} from 'react-icons/ai'
import {IoIosRemoveCircle} from 'react-icons/io'


function Param({thisKey, val, params, setParams}){

    function deleteKey(){
        const newObj = {...params}
        delete newObj[thisKey]
        setParams(newObj)
    }
    

    function updateParams(e){
        setParams({...params, [thisKey]: e.target.value})
    }
    return (
        <Box sx={{position: 'relative'}}>
            <TextField sx={{width: '375px'}}value={val} onChange={updateParams} id="outlined-basic" label={thisKey} variant="outlined" />
            <Button onClick={deleteKey} sx={{position: 'absolute', top: '10px', right: '0px', fontSize: '1.25rem'}}><IoIosRemoveCircle /></Button>
        </Box>
    )
}

function MapParams({params, setParams}){

    const mapParams = params ? Object.entries(params).map(([el, val])=>{return <Box key={el}><Param thisKey={el} val={val} params={params} setParams={setParams} /></Box>}) : <></>

    return mapParams
}

function App() {

    const [userId, setUserId] = useState('')
    const [hook, setHook] = useState('')
    const [myIP, setMyIP] = useState('')
    const [newIP, setNewIP] = useState(false)
    const [params, setParams] = useState()
    const [newParam, setNewParam] = useState('')

    function handleUserId(e){
        setUserId(e.target.value)
    }
    
    function handleSetHook(e){
        setHook(e.target.value)
    }
    
    function hanldeSetParam(e){
        setNewParam(e.target.value)
    }

    function addNewParam(e){
        e.preventDefault()
        const newParamsArray = {...params, [newParam]: ''}
        setNewParam('')
        setParams(newParamsArray)
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
            const convertParams = JSON.parse(stringParams)
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
        const paramString = JSON.stringify(params)
            chrome.storage.sync.set({"params": paramString})
    },[params])

    useEffect(()=>{
        if (newIP === true){
            setNewIP(false)
            if (myIP && hook){
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
                IP.SPY
            </Box>
            <Box sx={{padding: "2px", display: "flex", gap: "16px", flexDirection: "column"}} component="span">
                <TextField value={hook} onChange={handleSetHook} id="outlined-basic" label="Webhook" variant="outlined" />
                <TextField value={userId} onChange={handleUserId} id="outlined-basic" label="UserId/Email" variant="outlined" />
                <MapParams params={params} setParams={setParams} />
                <Button variant="contained" sx={{ width: '100%', margin: "auto" }} className="icons">
                    Public IP: {myIP}  <BiCopy onClick={()=>{navigator.clipboard.writeText(myIP)}} />
                </Button>
                <Button sx={{ width: '100%', margin: "auto" }} variant="contained" onClick={(logIP)}>Log IP Address</Button>
                <Box sx={{display: "flex", fontSize: "2rem" }} className="icons">
                    <TextField value={newParam} onChange={hanldeSetParam} sx={{ width: '80%'}} id="outlined-basic" label="New Query Parameter" variant="outlined" />
                    <Button sx={{display: "flex", fontSize: "2rem" }} onClick={addNewParam}>
                        <AiOutlineCheckCircle />
                    </Button>
                </Box>
            </Box>
        </div>
    );
}

export default App;
