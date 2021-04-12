// Marcas
const marcas = [{
        id: 1,
        nombre: "Pepsi",
        src: "img/marcas/1.png",
        pista: "Una de las marcas de gaseosa más famosa"


    }, {
        id: 2,
        nombre: "Carrefour",
        src: "img/marcas/2.png",
        pista: "Cadena de supermercados"

    },
    {
        id: 3,
        nombre: "Citroën",
        pista: "Marca francesa constructora de automóviles",
        src: "img/marcas/3.png"

    },
    {
        id: 4,
        nombre: "Coca Cola",
        pista: "Solía ser una bebida medicinal patentada",
        src: "img/marcas/4.png"

    }
]

// Contador y posición dentro de marcas, ambos inicializados en cero
let contador = 0;
let position = 0;


// Función para compilar handlebars
function compilarHandlebars(data, idTemp, idPlace) {
    let temp = $(idTemp).html()
    let compilar = Handlebars.compile(temp)
    let compilado

    if (data) compilado = compilar(data)
    else compilado = compilar()

    $(idPlace).html(compilado)
}

// para agregarle # a los ids
function ID(stringId) {
    return "#" + stringId
}

// para mezclar las marcas
function mezclar(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    // Mientras queden elementos a mezclar...
    while (0 !== currentIndex) {

        // Seleccionar un elemento sin mezclar...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // E intercambiarlo con el elemento actual
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// obtengo la marca según su posición en el json de las marcas por nivel
function getMarca(posicion) {
    $("#marca").toggle()
    let marca = marcas[posicion]

    let opciones = getOpciones(marca.id)
    let datos = { marca: marca, opciones: opciones }
    compilarHandlebars(datos, "#temp-marca", "#marca")

    setTimeout(' $("#marca").toggle("slow")', 200)
    $("#div-pistas").css("display", "block")

}

// cuando elije una de las opciones
function checkOption(idSeleccionado, idLi) {
    deshabilitarClickOption()
    const correct = parseInt($("#miMarca").val())
    if (correct === idSeleccionado) {
        $(ID(idLi)).css("background", "green")
        contador++
    } else {
        $(ID(idLi)).css("background", "red")
        marcarCorrecta()
    }

    position++
    if (position < marcas.length) {
        setTimeout('getMarca(' + position + ')', 900)
    }
    if (position === marcas.length) {
        let data = { contador: contador, total: marcas.length }
        compilarHandlebars(data, "#temp-show-result", "#body-modal-1")
        setTimeout('mostrarResultado()', 900)
    }
    $("#pista-1").css("display", "block")
    $("#pista-2").css("display", "none")

    if (parseInt($("#pistas-disponibles").text()) === 0) {
        $("#btn-pista").attr("disabled", true)
    } else {
        $("#btn-pista").attr("disabled", false)

    }

}


// muestra resultado 
function mostrarResultado() {
    $("#modal-1").modal("show")
    setTimeout('$("#modal-1").modal("hide")', 1700)
    contador = 0
    position = 0
    setTimeout('reiniciaJuego()', 1705)
}

function reiniciaJuego() {
    compilarHandlebars(null, "#temp-reinicio", "#marca")
    $("#div-pistas").css("display", "none")
    $("#pistas-disponibles").text(2)
    $("btn-pista").attr("disabled", false)
}

// muestra opciones disponibles para la marca
function getOpciones(id) {
    let opciones = []
    let opcion

    marcas.forEach(function(data) {
        if (data.id !== id) {
            data.clase = ""
            opciones.push(data)
        } else {
            opcion = data
            opcion.clase = "clase"
        }
    })

    opciones = mezclar(opciones)
    opciones = [opciones[0], opciones[1], opciones[2], opcion]
    opciones.forEach(function(data, i) {
        data.opcionId = "opcion_" + (i + 1)
    })
    opciones = mezclar(opciones)
    return opciones
}

// le saca el onclick a las opciones
function deshabilitarClickOption() {
    $("#ul-opciones .item-opciones").each(function() {
        $(this).removeAttr("onclick")
    })
}

// mostrar pista
function verPista() {
    let id = parseInt($("#miMarca").val())
    let pista

    marcas.forEach(function(data) {
        if (data.id === id) {
            pista = { pista: data.pista }
        }
    })
    compilarHandlebars(pista, "#temp-pista", "#pista-2")
    $("#pista-1").toggle("slow")
    $("#pista-2").toggle("slow")

    let disponibles = parseInt($("#pistas-disponibles").text())
    let quedan = disponibles - 1
    $("#pistas-disponibles").text(quedan)
}


// mostrar opción correcta
function marcarCorrecta() {
    $("#ul-opciones .item-opciones").each(function() {
        if ($(this).hasClass("clase")) {
            $(this).css("background", "green")
        }
    })
}