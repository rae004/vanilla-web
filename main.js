const resetButtonDelay = 7000;

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
    const ourSocialActivity = await fetch('https://www.boredapi.com/api/activity');
    return await ourSocialActivity.json();
}

async function socialCallback(event) {
    const existingDiv = event.target;
    const newDiv = document.createElement('div');
    const socialActivity = await getSocialActivity();
    const socialText = document.createTextNode(`You should ${socialActivity.activity.toLowerCase()}`);
    newDiv.setAttribute('class', 'buttonStyles');
    newDiv.appendChild(socialText);
    existingDiv.parentNode.replaceChild(newDiv, existingDiv);

    resetElementTimeout(existingDiv, newDiv);
}

async function createSocialButton() {
    const button = document.getElementById('social-button')
    button.setAttribute('class', 'buttonStyles')
    button.addEventListener('click', socialCallback);
}

async function getCatFact() {
    const ourCatFact = await fetch('https://catfact.ninja/fact');
    return await ourCatFact.json();
}

async function catCallback(event) {
    const existingDiv = event.target;
    const newDiv = document.createElement('div');
    const catFact = await getCatFact();
    const catText = document.createTextNode(`Did you know ${catFact.fact.toLowerCase()}`);
    newDiv.setAttribute('class', 'buttonStyles')
    newDiv.appendChild(catText);
    existingDiv.parentNode.replaceChild(newDiv, existingDiv);

    resetElementTimeout(existingDiv, newDiv);
}

async function catButton() {
    const button = document.getElementById('cat-button')
    button.setAttribute('class', 'buttonStyles')
    button.addEventListener('click', catCallback);
}

async function getCoinRate() {
    const ourCrypto = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
    return await ourCrypto.json();
}

async function coinCallback(event) {
    const existingDiv = event.target;
    const newDiv = document.createElement('div');
    const coinRate = await getCoinRate();
    const rate = coinRate.bpi.USD.rate;
    const disclaimerText = document.createTextNode(`${coinRate.disclaimer}`);
    const coinText = document.createTextNode(`$${rate.slice(0, rate.length -2)}`);
    newDiv.setAttribute('class', 'buttonStyles');
    newDiv.appendChild(disclaimerText);
    [0,1].forEach(() => newDiv.appendChild(document.createElement('br')));
    newDiv.appendChild(coinText);
    existingDiv.parentNode.replaceChild(newDiv, existingDiv);

    resetElementTimeout(existingDiv, newDiv);
}

async function coinButton() {
    const button = document.getElementById('coin-button')
    button.setAttribute('class', 'buttonStyles')
    button.addEventListener('click', coinCallback);
}

function resetElementTimeout(replacementElm, targetElm) {
    return setTimeout(() => {
        targetElm.parentNode.replaceChild(replacementElm, targetElm)
    }, resetButtonDelay)
}

function getName() {
    return ' Greg,';
}

const copyToClipboard = (str) => {
    const canWeCopyToClipboard = navigator && navigator.clipboard && navigator.clipboard.writeText;
    const ourSeparator = str.target.copySeparator
    const text = ourSeparator ? str.target.textContent.split(ourSeparator) : str.target.textContent;
    if (canWeCopyToClipboard) {
        let textToCopy;
        const isTextArray = Array.isArray(text);

        if (isTextArray && ourSeparator)  {
            text.shift();
            textToCopy = text.join(ourSeparator).trim()
        } else {
            textToCopy = text.trim()
        }

        return navigator.clipboard.writeText(textToCopy);
    }
    return Promise.reject('The Clipboard API is not available.');
};

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
            nestedElem.copySeparator = ':'
            const text = document.createTextNode(`Your ${data}: ${apiResponse[data]}`);
            nestedElem.appendChild(text)
            document.getElementById('our-target').appendChild(nestedElem)
        }
    });

    await createSocialButton();
    await catButton();
    await coinButton();
}