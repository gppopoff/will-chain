function handleWillClick() {
    document.getElementById('death-certificates-container').style.display = 'none';
    
    document.getElementById('wills-container').style.display = 'block';
}

function handleDeathCertificateClick() {
    document.getElementById('wills-container').style.display = 'none';
    document.getElementById('death-certificates-container').style.display = 'block';
    
}

document.getElementById('will-button').addEventListener('click', handleWillClick);
document.getElementById('death-certificate-button').addEventListener('click', handleDeathCertificateClick);
