submitFormulier();

function submitFormulier(){
    document.getElementById('like').addEventListener('submit', clickedLiked);
}

function clickedLiked(){
    document.getElementById('hartje').id='geliked';
}

console.log('javascriptfile aangeroepen');