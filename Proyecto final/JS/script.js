document.addEventListener("DOMContentLoaded", () => {
    // Declaramos las constantes tomándolas del HTML
    const casillas = document.querySelectorAll(".tablero div")
    const tablero = document.querySelector(".tablero")
    const mostrarPuntos = document.querySelector(".contarPuntos")
    const mostrarVidas = document.querySelector(".numeroVidas")
    const botonJugar = document.querySelector(".botonJugar")

    const ancho = 30

    // Declaramos las variables
    let cuerpoSerpiente
    let posicionManzana
    let direccion
    let velocidad
    let puntos, vidas
    let intervalo
    let intervaloDeTiempo
    let pausa = false //Se inicializa pausa como false, ya se cambia solo a true cuando se pierde

    //Inicializamos las variables
    vidas = 3
    puntos = 0

    // Funcion para iniciar el juego
    const iniciarPartida = () => {
        tablero.style = "background-color: #def7ff;" //Cada vez que reiniciemos el juego, el tablero se pondrá de color azul, incluso aunque estuviese negro por pausar el juego
        if(cuerpoSerpiente){ //Para cuando se reinicie, si hay una serpiente (y por tanto una manzana, pues significa que había una partida), ambas se borrarán
            cuerpoSerpiente.forEach(index => casillas[index].classList.remove("serpiente")) 
            casillas.forEach(element => element.classList.remove("manzana"))
        }

        clearInterval(intervalo) //Limpia el posible intervalo que haya de la partida anterior, para que no se acumulen

        //Inicializamos las variables
        direccion = 1 //Hacia la derecha
        intervaloDeTiempo = 200 //Para que se mueva cada 200ms
        velocidad = 0.95 //La velocidad de la serpiente aumentará un 5% cada vez que coma una manzana
        cuerpoSerpiente = [302, 301, 300] //La serpiente empieza en la posición 302, 301 y 300
        pausa = false //Se inicializa pausa como false, ya que si venimos de una partida anterior, se habrá puesto a true

        generarManzana() //Generamos la manzana por primera vez ya que no hay ninguna en el tablero y se generan nuevas al comer la anterior
        
        mostrarPuntos.innerText = puntos //Mostramos el total de puntos de esas 3 vidas
        mostrarVidas.innerText = vidas //Mostramos las vidas que quedan
        cuerpoSerpiente.forEach(index => casillas[index].classList.add("serpiente")) //Añadimos la clase "serpiente" a cada una de las casillas que ocupa cuerpoSerpiente
        intervalo = setInterval(avanzarSerpiente, intervaloDeTiempo) //Llamamos a la función avanzarSerpiente cada intervaloDeTiempo, es decir la serpiente se avanzará cada 200ms
    }

    const avanzarSerpiente = () => {
        if 
        (
            (cuerpoSerpiente[0] + ancho >= (ancho * ancho) && direccion === ancho) || //Si la cabeza de la serpiente está en la última fila y se mueve hacia abajo
            (cuerpoSerpiente[0] % ancho === 0 && direccion === -1) || //Si la cabeza de la serpiente está en la primera columna y se mueve hacia la izquierda
            (cuerpoSerpiente[0] % ancho === ancho - 1 && direccion === 1) || //Si la cabeza de la serpiente está en la última columna y se mueve hacia la derecha
            (cuerpoSerpiente[0] - ancho < 0 && direccion === -ancho) || //Si la cabeza de la serpiente está en la primera fila y se mueve hacia arriba
            casillas[cuerpoSerpiente[0] + direccion].classList.contains("serpiente") //Si la cabeza de la serpiente se encuentra su cuerpo
        ) //Si alguna de las condiciones se cumple, s se acaba el juego, se resta una vida y la manzana desaparece
        { 
            pausa = true //Se pone pausa al juego para que no se pueda seguir jugando
            tablero.style = "background-color: black"
            mostrarVidas.innerText = --vidas
            casillas.forEach(element => element.classList.remove("manzana"))
            if(vidas === 0){ //Si se acaban las vidas al restar una, se reinician las variables y se muestra GAME OVER
                puntos = 0
                mostrarVidas.innerText = "GAME OVER"
                vidas = 3
                return clearInterval(intervalo)
            } else { //Si no se acaban las vidas, se mantienen los puntos y se reinicia la partida
                return clearInterval(intervalo)
            }
        }
        //Hacemos que la serpiente se mueva borrando la última posición y añadiendo una nueva cabeza delante de la cabeza actual
        const finalSerpiente = cuerpoSerpiente.pop()
        casillas[finalSerpiente].classList.remove("serpiente")
        cuerpoSerpiente.unshift(cuerpoSerpiente[0] + direccion)

        //Si la cabeza de la serpiente está en la misma posición que la manzana, desaparece esa manzana, la serpiente crece, aumenta los puntos en 1, se aumenta la velocidad y se genera una nueva manzana
        if(casillas[cuerpoSerpiente[0]].classList.contains("manzana")) {
            casillas[cuerpoSerpiente[0]].classList.remove("manzana")
            casillas[finalSerpiente].classList.add("serpiente")
            cuerpoSerpiente.push(finalSerpiente)
            mostrarPuntos.textContent = ++puntos
            intervaloDeTiempo = intervaloDeTiempo * velocidad
            generarManzana()
            clearInterval(intervalo) //Se limpia el intervalo para poner el nuevo
            intervalo = setInterval(avanzarSerpiente, intervaloDeTiempo) //Se renueva el intervaloDeTiempo a avanzarSerpiente, es decir, la serpiente se moverá más rápido
        }
        casillas[cuerpoSerpiente[0]].classList.add("serpiente") //Se añade la clase "serpiente" a la nueva cabeza, es decir se coloreará la casilla
    }
    
    //Esta función genera una manzana en una posición aleatoria que no esté ocupada por la serpiente
    function generarManzana() {
        do {
            posicionManzana = Math.floor(Math.random() * casillas.length)
        } while (casillas[posicionManzana].classList.contains("serpiente")) {
            casillas[posicionManzana].classList.add("manzana")
        }
    }

    //Esta función controla las flechas del teclado en codigo ascii que se pulsan para mover la serpiente
    function controlSerpiente(e) {
        if(e.keyCode === 39 && direccion != -1) { //Si se pulsa la tecla derecha y la serpiente no se está moviendo hacia la izquierda, gira hacia la derecha
            direccion = 1
        } else if (e.keyCode === 38 && direccion != ancho) {   //Si se pulsa la tecla arriba y la serpiente no se está moviendo hacia abajo, gira hacia arriba
            direccion = -ancho
        } else if (e.keyCode === 37 && direccion != 1) {  //Si se pulsa la tecla izquierda y la serpiente no se está moviendo hacia la derecha, gira hacia la izquierda
            direccion = -1
        } else if (e.keyCode === 40 && direccion != -ancho) { //Si se pulsa la tecla abajo y la serpiente no se está moviendo hacia arriba, gira hacia abajo
            direccion = ancho
        }
    }

    document.addEventListener("keydown", controlSerpiente) //Se añade el evento keydown para que la función controlSerpiente pueda captar las teclas que pulsemos
    botonJugar.addEventListener("click", iniciarPartida) //Se añade el evento click para que la función iniciarPartida se ejecute al hacer click en el botón jugar
    tablero.addEventListener("click", () => { //Se añade el evento click para pausar o reanudar el juego haciendo click en el tablero
        if(!pausa){ //Si el juego no está pausado, se pausa y se cambia el color del tablero a negro
            clearInterval(intervalo) 
        } else { //Si el juego está pausado, se reanuda y se cambia el color del tablero a azul
            intervalo = setInterval(avanzarSerpiente, intervaloDeTiempo)
        }
        tablero.style = (pausa ? "background-color: #def7ff" : "background-color: black;")
        pausa = !pausa
    })
})