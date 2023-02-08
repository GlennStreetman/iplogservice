async function postIP(url, data, updateMsg) {
    try{
        console.log('posting IP update')
        const formatData = JSON.stringify(data)
        console.log(formatData)
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            },
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: formatData // body data type must match "Content-Type" header
        })
        const format = await response.json()
        if(format?.msg) updateMsg(format.msg)
        console.log(format)
    } catch(err){
        console.log('Error Logging IP: ', err)
        updateMsg('Error loggin IP, review webhook and check logs')
    }
}

export default postIP