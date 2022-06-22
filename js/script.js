


function mensagens() {
    let ul = document.querySelector('ul');

    const template = `<li><p><span>(09:22:48)</span> <strong>João</strong>  reservadamente para <strong>Maria</strong> :  Oi gatinha quer tc?</p></li>`

    ul.innerHTML = template;
}
mensagens();