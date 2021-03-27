//Variabele
let sendMessageBtn = document.getElementsByClassName('sendMessageBtn')

let closeFormBtn = document.querySelector('#closeFormBtn')
let submitBtn = document.querySelector('#submitBtn')
let sendMessageForm = document.querySelector('#sendMessageForm')

let fromInput = document.querySelector('#fromInput')
let toInput = document.querySelector('#toInput')
let personalMsg = document.querySelector('#personalMsg')


//Functies
const openForm = (e) => {
    sendMessageForm.classList.add('fromOverlayOn')
    fromInput.value = e.target.attributes[2].value
    toInput.value = e.target.attributes[1].value
}

const closeForm = () => {
    sendMessageForm.classList.remove('fromOverlayOn')
    fromInput.value = ""
    toInput.value = ""
    personalMsg.value = ""
}

const sendEmail = (e) => {
    e.preventDefault()
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            if(xhttp.responseText){
                closeForm()
                alert('email succesvol');
            }
        }
        if (xhttp.status == 500) {
            console.log('Niet genoeg velden');
        }
    }
    xhttp.open("POST", "/sendMail", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(`fromMail=${fromInput.value}&toMail=${toInput.value}&personalMsg=${personalMsg.value}`);
}


//EventListeners
for(let i=0; i<sendMessageBtn.length; i++) {
    sendMessageBtn[i].addEventListener('click', openForm, false)
}
closeFormBtn.addEventListener('click', closeForm, false)
submitBtn.addEventListener('click', sendEmail, false)