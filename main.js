async function getIp() {
    const response = await fetch('https://api.ipify.org?format=json');
    return await response.json();
}

async function getLocation(ip) {
    const response = await fetch(`https://ipinfo.io/${ip}/geo`);
    return await response.json();
}

async function myLocation() {
    const ourIp = await getIp();
    return await getLocation(ourIp.ip);
}

async function getSocialActivity() {
    const ourSocialActivity = await fetch('https://www.boredapi.com/api/activity?type=social');
    return await ourSocialActivity.json();
}

async function socialCallback(event) {
    const newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'social')
    const socialActivity = await getSocialActivity();
    const socialText = document.createTextNode(`You should ${socialActivity.activity.toLowerCase()}`);
    newDiv.appendChild(socialText);
    event.target.parentNode.replaceChild(newDiv, event.target);
}

async function createSocialButton() {
    const button = document.getElementById('social-button')
    button.setAttribute('class', 'social')
    button.addEventListener('click', socialCallback);
}

const copyToClipboard = (str) => {
    const canWeCopyToClipboard = navigator && navigator.clipboard && navigator.clipboard.writeText;
    const text = str.target.textContent.split(':');
    if (canWeCopyToClipboard) {
        return navigator.clipboard.writeText(text[1].trim());
    }
    return Promise.reject('The Clipboard API is not available.');
};

function getName() {
    return ' Greg,';
}

window.onload = async () => {
    const header = document.getElementById('name-header')
    const name = document.createTextNode(getName());
    header.appendChild(name);
    myLocation().then((apiResponse) => {
        console.log('our api data: ', apiResponse);
        for (const data in apiResponse) {
            const nestedElem = document.createElement('div');
            nestedElem.addEventListener('click', copyToClipboard);
            nestedElem.setAttribute('title', 'Click to copy to Clipboard!');
            const text = document.createTextNode(`Your ${data}: ${apiResponse[data]}`);
            nestedElem.appendChild(text)
            document.getElementById('our-target').appendChild(nestedElem)
        }
    });
    await createSocialButton()
}