passwordLength.addEventListener('keyup', () => {
    const passwordLength = document.getElementById('passwordLength')
    const message = document.getElementById('error-nwl')
    const freezeButton = document.getElementById('freezeButton')
    const errorColor = '#ed2924'
    const succesColor = '#00ab66'

    if(passwordLength.value.length > 7) {
        message.style.color = succesColor
        message.style.borderColor = succesColor
        message.innerHTML = 'Uw wachtwoord voldoet aan de eisen'
        freezeButton.classList.remove('disabled');
    } else {
        message.style.display = 'block'
        message.style.color = errorColor
        message.style.borderColor = errorColor
        message.innerHTML = 'Uw wachtwoord heeft minimaal 8 tekens nodig'
        freezeButton.classList.add('disabled');
    }
})