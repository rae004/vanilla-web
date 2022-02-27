async function getIp() {
    const response = await fetch('https://api.ipify.org?format=json');
    const results = await response.json()
    return results;
}

async function getLocation(ip) {
    const response = await fetch(`https://ipinfo.io/${ip}/geo`);
    const results = await response.json()
    return results;
}

async function myLocation() {
    const ourIp = await window.getIp();
    return await window.getLocation(ourIp.ip);
}

window.onload = () => {
    myLocation().then((res) => {
        const element = document.createElement('div');
        for (const data in res) {
            const nestedElem = document.createElement('div');
            const text = document.createTextNode(`Your ${data}: ${res[data]}`);
            nestedElem.appendChild(text)
            element.appendChild(nestedElem)
        }
        document.getElementById('our-target').appendChild(element)
    });
}