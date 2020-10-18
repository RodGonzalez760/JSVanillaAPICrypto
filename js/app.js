const monedaSelect = document.querySelector('#moneda');
const criptomonedaSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const divResultado = document.querySelector('#resultado');

// Objetos
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}


// Crear un promise, que se va a ejecutar solo en el caso de que resuelva y pueda descargar la información de las criptomonedas
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

    // Consultamos la API, para cargar el selecto con los valores que queremos que sean parte de las opciones...
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

/* Antes de async await
    fetch(url)
        .then( respuesta => respuesta.json() )                                  // entonces obtiene una respuesta
        .then( resultado => obtenerCriptomonedas(resultado.Data) )              // entonces obten lo que son las criptomonedas
        .then( criptomonedas => selectCriptomonedas(criptomonedas))             // entonces Hacemos algo con las cripotomonedas
*/

// Async await
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
    // como criptomonedas es un arreglo iteramos sobre criptomonedas
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedaSelect.appendChild(option);
    });
}

function leerValor(e) {
    /*
            // En esta ocación e.target.name está haciendo referencia directamente al siguiente HTML:
         <select                                e 
            class="u-full-width"                target class
            id="criptomonedas"                  target id
            name="criptomoneda"                 target name ****
        >
            // Y e.target.value a :
            <option                             e
                value="BTC"                     target value ****
            >Bitcoin</option>

    */
   
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda)

    
}

function submitFormulario(e) {
    e.preventDefault();


    // Para validar obtenemos los datos del objeto
    const { moneda, criptomoneda } = objBusqueda;

    if ( moneda === '' || criptomoneda === '') {
        mostrarAlerta('Se deben seleccionar ambas Monedas');
        return;
    }

    // Consultar la API con los resultados
    consultarAPI();


}


// ****** Esta es la forma a memorizar para mostrar un Alerta ********
function mostrarAlerta(mensaje) {

    const existe = document.querySelector('.error');

    if (!existe) {

        // preparamos el elemento
        const divMensaje = document.createElement('div');
    
        // agregamos las clases que queramos
        divMensaje.classList.add('error');
    
        // Añadimos el texto al elemento
        divMensaje.textContent = mensaje;
    
        // Lo insertamos en el DOM
        formulario.appendChild(divMensaje);
    
        // Definimos un tiempo para que el mensaje desaparezca
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
    }


}

async function consultarAPI() {

    // No pide parametros ya que obtendremos los valores directamente desde el objeto, aqui ya hemos pasado la validación
    const { moneda, criptomoneda } = objBusqueda;

    // Ahora consultamos la API, pero solo para obtener el valor de la criptomoneda de la opcion seleccionada. 
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

/* Antes de async await
    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( resultado => {
            // De esta forma hacemos dinamicos también los resultados de la busqueda
            mostrarCotizacionHtml(resultado.DISPLAY[criptomoneda][moneda]) // el resultado como cotización, pasamos de manera dinamica los valores de criptomoneda y moneda que este seleccionando el usuario, de esta forma podremos acceder a los valores correctos aún cuando se cambien las opciones
        })     
*/
  
// Asinc Await
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarCotizacionHtml(resultado.DISPLAY[criptomoneda][moneda]);
        
    } catch (error) {
        console.log(error);
    }
    
}

function mostrarCotizacionHtml(cotizacion) {

    // Para evitar que se repita la información en pantalla podemos utilizar la función limiarHTML(), el uso del if (!existe) se usa solamente para el envío de alertas
    limpiarHTML();


        const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
    
        const precio = document.createElement('p');
        precio.classList.add('precio');
    
        // Usaremos InnerHtml por que sabemos de donde vienen los datos y por que mezclaremos Html con un poco de código.
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

    // Para este caso utilizamos el template de string solamente para tener la capacidad de escribir en multilineas
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>   
    `;

    resultado.appendChild(spinner);
}