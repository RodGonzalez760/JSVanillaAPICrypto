const monedaSelect = document.querySelector('#moneda');
const criptomonedaSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const divResultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    
    consultarCriptomoneda();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedaSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);

});

async function consultarCriptomoneda() {

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);

    } catch (error) {
        console.log(error);
    }

    
    
};

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedaSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda)
}

function submitFormulario(e) {
    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;

    if ( moneda === '' || criptomoneda === '') {
        mostrarAlerta('Se deben seleccionar ambas Monedas');
        return;
    }

    consultarAPI();
}

function mostrarAlerta(mensaje) {

    const existe = document.querySelector('.error');

    if (!existe) {

        const divMensaje = document.createElement('div');
    
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;
    
        formulario.appendChild(divMensaje);
   
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
    }
}

async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarCotizacionHtml(resultado.DISPLAY[criptomoneda][moneda]);
        
    } catch (error) {
        console.log(error);
    }
    
}

function mostrarCotizacionHtml(cotizacion) {

    limpiarHTML();
    
        const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
    
        const precio = document.createElement('p');
        precio.classList.add('precio');
        precio.innerHTML = `El precio es: <span>${PRICE}</span>`;
    
        const precioAlto = document.createElement('p');
        precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span></p> `;
    
        const precioBajo = document.createElement('p');
        precioBajo.innerHTML = `El precio más bajo del día: <span>${LOWDAY}</span>`;
    
        const ultimasHoras = document.createElement('p');
        ultimasHoras.innerHTML = `Variación últimas 24 Horas: <span>${CHANGEPCT24HOUR} %</span>`;
    
        const ultimaActualizacion = document.createElement('p');
        ultimaActualizacion.innerHTML = `Última Actualización: <span>${LASTUPDATE}</span>`;
    
        divResultado.appendChild(precio);
        divResultado.appendChild(precioAlto);
        divResultado.appendChild(precioBajo);
        divResultado.appendChild(ultimasHoras);
        divResultado.appendChild(ultimaActualizacion);

    
}

function limpiarHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>   
    `;

    resultado.appendChild(spinner);
}
