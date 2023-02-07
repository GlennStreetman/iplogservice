
import './App.css';
import {useState, useEffect} from 'react'
import Button from '@mui/material/Button';
import {AiOutlineCopy} from 'react-icons/ai'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function App() {

    const [ips, setIps] = useState()
    const [rows, setRows] = useState([])
    const [IPList, setIPList] = useState()

    console.log('url', process.env.url)

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_url}`)
        .then((response) => response.json())
        .then((data) => setIps(data))
        .catch((err)=>{console.log(err)})    
    }, [])

    useEffect(()=>{
    
    //full ip list
    const ipMap = ips?.Items ? Object.values(ips.Items).map((el)=> el.ipaddress.S) : []
    setIPList(ipMap.join(', '))

    //table rows

    setRows(ips?.Items ? Object.values(ips.Items).map((el)=> {
        return {
            name: el?.username?.S || '',
            ipAddress: el?.ipaddress?.S || '',
            date: el?.logdate?.S || '',
        }
    }) : [])

    }, [ips])

    return (
        <>
        <div sx={{width: '800px'}}  className="App-header">
        <Button  onClick={() =>  navigator.clipboard.writeText(IPList)}>
            Copy All IP Addresses <AiOutlineCopy />
        </Button>
        <div className={{width: "800px"}}>
        <TableContainer x={{ minWidth: 650, width: '800px' }}  component={Paper}>
            <Table sx={{ minWidth: 650, width: '800px' }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell align="left">User Name</TableCell>
                    <TableCell align="right">IP Address</TableCell>
                    <TableCell align="right">Date</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                <TableRow
                    key={`${row.name}${row.ipAddress}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="right">{row.ipAddress}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </div>
    </div>
    </>
    );
}

export default App;
