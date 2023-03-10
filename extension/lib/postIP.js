async function postIP(url, data, setMsg=undefined) {
    try{
        console.log('posting IP update', url)
        const formatData = JSON.stringify(data)
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
        if(format?.msg && setMsg) setMsg(format.msg)
        chrome.storage.sync.set({"myIP": data.ip})
    } catch(err){
        console.log('Error Logging IP: ', err)
        if (setMsg) setMsg('Error loggin IP, review webhook and check logs')
    }
}

export default postIP