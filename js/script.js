let dados;
let usuario;
let cont = 0;
let newuser = {};

cadastroUsuario();

function cadastroUsuario() {
    usuario = prompt("Informe seu nome");

    newuser = {
        name: usuario
    }
    let info = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', newuser)

    info.then(alertAcerto);
    info.catch(alertErro);
}


function statusUser() {
    let activeUser = setInterval(() => {
        axios.post('https://mock-api.driven.com.br/api/v6/uol/status', newuser)
            .then(() => console.log("Usuário Ativo"))
    }, 5000);
}

function alertAcerto(resposta) {
    console.log(resposta.status);
    let retorno = resposta.status;
    if (retorno === 200)
        console.log("Tudo certo");
    main();
}

function main(){
    statusUser();
    updateMessages();
}

function alertErro(error) {
    let resposta = error.response.status;
    switch (resposta) {
        case 400:
            alert(`Nome ${newuser.name} já existe`);
            newuser.name = "";
            contErro();
            break;
        default:
            newuser.name = "";
            contErro();
    }
    cadastroUsuario();
}
function contErro() {
    cont++;
    if (cont == 3) {
        window.location.reload();
        cont = 0;
    }
}
function updateMessages(){
    setInterval(initServidor,3000);
}

function initServidor() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(alerta);
}
function alerta(elemento) {
    dados = elemento.data;
    console.log(dados);
    mensagens();
}
function mensagens() {
    let ul = document.querySelector('.main');
    ul.innerHTML = "";
    for (let i = 0; i < dados.length; i++) {
        if (dados[i].type === "status") {
            const template = `<li class="color1"><p><span>(${dados[i].time})</span> <strong>${dados[i].from}</strong> ${dados[i].text}</p></li>`
            ul.innerHTML += template;
        }
        else if (dados[i].type === "message") {
            const template = ` <li class="color2"><p><span>(${dados[i].time})</span> <strong>${dados[i].from}</strong> para <strong>${dados[i].to}</strong> : ${dados[i].text}</p></li>`
            ul.innerHTML += template;
        }
        else if (dados[i].type === "private_message" && dados[i].to === newuser.name ) {
            const template = ` <li class="color3"><p><span>(${dados[i].time})</span> <strong>${dados[i].from}</strong> para <strong>${dados[i].to}</strong> : ${dados[i].text}</p></li>`
            ul.innerHTML += template;
        }
        let lastMensage = document.querySelector(".main li:last-child");
        lastMensage.scrollIntoView();
    }
}
function enviar() {
    enviaMensagens();
}

function enviaMensagens() {
    let input = document.querySelector("input").value;

    const inputMensage = {
        from: newuser.name,
        to: "Todos",
        text: input,
        type: "message"
    }
    console.log(inputMensage);
    if (input === "") {
        return false;
    }
    document.querySelector("input").value = "";
    axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', inputMensage)
    .then(response=>{
        initServidor();
        }).catch(error =>{
            console.log(error);
            contErro();
        });
}

// function toggleMenu() {
//     document.querySelector(".menu").classList.toggle("show-menu");
// }

