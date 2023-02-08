import Param from './Params'
import Box from '@mui/material/Box';

function MapParams({params, setParams}){

    const mapParams = params ? Object.entries(params).map(([el, val])=>{return <Box key={el}><Param thisKey={el} val={val} params={params} setParams={setParams} /></Box>}) : <></>

    return mapParams
}

export default MapParams