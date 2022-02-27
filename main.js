async function getIp() {
    const response = await fetch('https://api.ipify.org?format=json');
    return await response.json();
}

async function getLocation(ip) {
    const response = await fetch(`https://ipinfo.io/${ip}/geo`);
    return await response.json();
}

async function myLocation() {
    const ourIp = await window.getIp();
    return await window.getLocation(ourIp.ip);
}

window.onload = () => {
    myLocation().then((res) => {
        console.log('our api data: ', res);
        for (const data in res) {
            const nestedElem = document.createElement('div');
            const text = document.createTextNode(`Your ${data}: ${res[data]}`);
            nestedElem.appendChild(text)
            document.getElementById('our-target').appendChild(nestedElem)
        }
    });
}