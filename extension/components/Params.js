import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

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

export default Param