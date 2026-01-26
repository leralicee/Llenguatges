// Variables globals
let configuracion = {
    numEquipos: 0,
    numEquiposAjustado: 0,
    tipoNombres: 'numeros',
    modoResultado: 'marcador',
    numByes: 0
};

let equipos = [];
let bracket = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Boto continuar (seccio 1 -> seccio 2)
    document.getElementById('btn-continuar').addEventListener('click', validarYContinuar);

    // Validacio en temps real del num d'equips
    document.getElementById('num-equipos').addEventListener('input', mostrarAvisoByes);

    // Boto tornar a configuracio
    document.getElementById('btn-volver-config').addEventListener('click', volverAConfig);

    // Boto generar torneig (seccio 2 -> seccio 3)
    document.getElementById('btn-generar-torneo').addEventListener('click', generarTorneo);

    // Boto reiniciar
    document.getElementById('btn-reiniciar').addEventListener('click', reiniciarTodo);
});

// Funcio per calcular la següent potencia de 2
function siguientePotenciaDe2(num) {
    let potencia = 1;
    while (potencia < num) {
        potencia *= 2;
    }
    return potencia;
}

// Mostrar avis de byes en temps real
function mostrarAvisoByes() {
    const numEquipos = parseInt(document.getElementById('num-equipos').value);
    const avisoByes = document.getElementById('aviso-byes');

    if (numEquipos && numEquipos >= 2) {
        const equiposAjustados = siguientePotenciaDe2(numEquipos);
        const numByes = equiposAjustados - numEquipos;

        if (numByes > 0) {
            avisoByes.innerHTML = `⚠️ Has introduït ${numEquipos} equips. Es generarà un torneig per a ${equiposAjustados} equips on ${numByes} equip${numByes > 1 ? 's' : ''} passarà${numByes > 1 ? 'n' : ''} directament a la següent ronda (bye).`;
            avisoByes.classList.remove('hidden');
        } else {
            avisoByes.classList.add('hidden');
        }
    } else {
        avisoByes.classList.add('hidden');
    }
}

// Validar y pasar a la seccio de noms
function validarYContinuar() {
    const numEquipos = parseInt(document.getElementById('num-equipos').value);

    if (!numEquipos || numEquipos < 2) {
        alert('Si us plau, introdueix un nombre d\'equips vàlid (mínim 2)');
        return;
    }

    // Guardar configuracio
    configuracion.numEquipos = numEquipos;
    configuracion.numEquiposAjustado = siguientePotenciaDe2(numEquipos);
    configuracion.numByes = configuracion.numEquiposAjustado - numEquipos;
    configuracion.tipoNombres = document.querySelector('input[name="tipo-nombres"]:checked').value;
    configuracion.modoResultado = document.querySelector('input[name="modo-resultado"]:checked').value;

    // Mostrar seccio de noms
    mostrarSeccion('seccion-nombres');
    generarInputsNombres();
}

// Generar inputs pels noms dels equips
function generarInputsNombres() {
    const gridEquipos = document.getElementById('grid-equipos');
    const mensajeInfo = document.getElementById('mensaje-info');

    // Missatge informatiu
    let mensaje = `Introdueix els noms dels ${configuracion.numEquipos} equips.`;
    if (configuracion.numByes > 0) {
        mensaje += ` <strong>${configuracion.numByes} equip${configuracion.numByes > 1 ? 's' : ''} passarà${configuracion.numByes > 1 ? 'n' : ''} directament a la següent ronda.</strong>`;
    }
    mensajeInfo.innerHTML = mensaje;

    // Determinar num de columnes segons quantitat d'equips
    let numCols = 1;
    if (configuracion.numEquipos >= 32) numCols = 4;
    else if (configuracion.numEquipos >= 16) numCols = 3;
    else if (configuracion.numEquipos >= 8) numCols = 2;

    // Crear grid
    gridEquipos.innerHTML = '';
    gridEquipos.className = `grid grid-cols-1 md:grid-cols-${numCols} gap-4`;

    // Generar inputs
    for (let i = 1; i <= configuracion.numEquipos; i++) {
        const nombreDefault = configuracion.tipoNombres === 'numeros'
            ? `Equip ${i}`
            : `Equip ${String.fromCharCode(64 + i)}`;

        const inputDiv = document.createElement('div');
        inputDiv.innerHTML = `
            <label for="equipo-${i}" class="block mb-1 text-sm font-medium text-gray-700">
                Equip ${i}
            </label>
            <input 
                type="text" 
                id="equipo-${i}" 
                value="${nombreDefault}"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
        `;
        gridEquipos.appendChild(inputDiv);
    }
}

// Tornar a la configuracio
function volverAConfig() {
    mostrarSeccion('seccion-config');
}

// Generar el torneig
function generarTorneo() {
    // Recolir noms dels equips
    equipos = [];
    for (let i = 1; i <= configuracion.numEquipos; i++) {
        const nombre = document.getElementById(`equipo-${i}`).value.trim();
        if (!nombre) {
            alert(`Si us plau, introdueix un nom per a l'equip ${i}`);
            return;
        }
        equipos.push({
            id: i,
            nombre: nombre
        });
    }

    // Generar estructura del bracket
    generarBracket();

    // Mostrar seccio del torneig
    mostrarSeccion('seccion-torneo');

    // Renderitzar bracket
    renderizarBracket();
}

// Generar estructura del bracket
function generarBracket() {
    bracket = [];

    // Barrejar equips aleatoriament
    const equiposMezclados = [...equipos].sort(() => Math.random() - 0.5);

    // Determinar equips amb bye (aleatori)
    const equiposConBye = [];
    const equiposSinBye = [];

    if (configuracion.numByes > 0) {
        // Seleccionar aleatoriament quins equips tenen bye
        const indicesAleatorios = [];
        while (indicesAleatorios.length < configuracion.numByes) {
            const randomIndex = Math.floor(Math.random() * equiposMezclados.length);
            if (!indicesAleatorios.includes(randomIndex)) {
                indicesAleatorios.push(randomIndex);
            }
        }

        equiposMezclados.forEach((equipo, index) => {
            if (indicesAleatorios.includes(index)) {
                equiposConBye.push(equipo);
            } else {
                equiposSinBye.push(equipo);
            }
        });
    } else {
        equiposSinBye.push(...equiposMezclados);
    }

    // Calcular num de rondes
    const numRondas = Math.log2(configuracion.numEquiposAjustado);

    // Crear primera ronda
    const primeraRonda = [];
    for (let i = 0; i < equiposSinBye.length; i += 2) {
        primeraRonda.push({
            equipo1: equiposSinBye[i],
            equipo2: equiposSinBye[i + 1],
            puntos1: null,
            puntos2: null,
            ganador: null
        });
    }

    bracket.push(primeraRonda);

    // Crear rondes següents buides
    let equiposRondaAnterior = primeraRonda.length + equiposConBye.length;
    for (let r = 1; r < numRondas; r++) {
        const ronda = [];
        const numPartidos = equiposRondaAnterior / 2;

        for (let i = 0; i < numPartidos; i++) {
            // Si es la segona ronda i hi ha byes, inclourels
            if (r === 1 && equiposConBye.length > 0 && i < equiposConBye.length) {
                ronda.push({
                    equipo1: equiposConBye[i],
                    equipo2: null,
                    puntos1: null,
                    puntos2: null,
                    ganador: null,
                    esBye: true
                });
            } else {
                ronda.push({
                    equipo1: null,
                    equipo2: null,
                    puntos1: null,
                    puntos2: null,
                    ganador: null
                });
            }
        }

        bracket.push(ronda);
        equiposRondaAnterior = numPartidos;
    }

    // Si hi ha byes i nomes una ronda, afegir els byes
    if (numRondas === 1 && equiposConBye.length > 0) {
        // Els byes van directament al campio
        bracket[0] = bracket[0].concat(equiposConBye.map(equipo => ({
            equipo1: equipo,
            equipo2: null,
            puntos1: null,
            puntos2: null,
            ganador: equipo,
            esBye: true
        })));
    }
}

// Renderitzar el bracket
function renderizarBracket() {
    const container = document.getElementById('bracket-container');
    container.innerHTML = '';

    const bracketsWrapper = document.createElement('div');
    bracketsWrapper.className = 'flex gap-8 justify-center items-start';

    // Noms de las rondes
    const nombresRondas = generarNombresRondas(bracket.length);

    bracket.forEach((ronda, indexRonda) => {
        const columnaRonda = document.createElement('div');
        columnaRonda.className = 'flex flex-col gap-4 min-w-[250px]';

        // Titol de la ronda
        const tituloRonda = document.createElement('h3');
        tituloRonda.className = 'text-lg font-bold text-center mb-2 text-gray-700';
        tituloRonda.textContent = nombresRondas[indexRonda];
        columnaRonda.appendChild(tituloRonda);

        // Enfrentaments
        ronda.forEach((partido, indexPartido) => {
            const partidoDiv = crearPartidoHTML(partido, indexRonda, indexPartido);
            columnaRonda.appendChild(partidoDiv);
        });

        bracketsWrapper.appendChild(columnaRonda);
    });

    container.appendChild(bracketsWrapper);
}

// Generar noms de rondes
function generarNombresRondas(numRondas) {
    const nombres = [];

    if (numRondas === 1) {
        nombres.push('Final');
    } else if (numRondas === 2) {
        nombres.push('Semifinals', 'Final');
    } else if (numRondas === 3) {
        nombres.push('Quarts de final', 'Semifinals', 'Final');
    } else if (numRondas === 4) {
        nombres.push('Vuitens de final', 'Quarts de final', 'Semifinals', 'Final');
    } else {
        for (let i = 0; i < numRondas - 3; i++) {
            nombres.push(`Ronda ${i + 1}`);
        }
        nombres.push('Quarts de final', 'Semifinals', 'Final');
    }

    return nombres;
}

// Crear HTML d'un partit
function crearPartidoHTML(partido, indexRonda, indexPartido) {
    const partidoDiv = document.createElement('div');
    partidoDiv.className = 'bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm';
    partidoDiv.dataset.ronda = indexRonda;
    partidoDiv.dataset.partido = indexPartido;

    // Si es un bye
    if (partido.esBye) {
        partidoDiv.innerHTML = `
            <div class="text-center text-sm text-gray-500 italic mb-2">BYE</div>
            <div class="font-semibold text-green-600 text-center">${partido.equipo1.nombre}</div>
            <div class="text-xs text-center text-gray-500 mt-2">Passa automàticament</div>
        `;
        return partidoDiv;
    }

    // Si el partit no te equips definits encara
    if (!partido.equipo1) {
        partidoDiv.innerHTML = `<div class="text-center text-sm text-gray-400 italic">Pendent de resultats anteriors</div>`;
        return partidoDiv;
    }

    // Si ja hi ha un guanyador
    if (partido.ganador) {
        const esGanador1 = partido.ganador.id === partido.equipo1.id;
        partidoDiv.innerHTML = `
            <div class="mb-2">
                <div class="flex justify-between items-center ${esGanador1 ? 'font-bold text-green-600' : 'text-gray-500'}">
                    <span>${partido.equipo1.nombre}</span>
                    ${partido.puntos1 !== null ? `<span class="ml-2">${partido.puntos1}</span>` : ''}
                </div>
            </div>
            ${partido.equipo2 ? `
            <div class="mb-2">
                <div class="flex justify-between items-center ${!esGanador1 ? 'font-bold text-green-600' : 'text-gray-500'}">
                    <span>${partido.equipo2.nombre}</span>
                    ${partido.puntos2 !== null ? `<span class="ml-2">${partido.puntos2}</span>` : ''}
                </div>
            </div>
            ` : ''}
            <div class="text-sm text-green-600 font-semibold text-center mt-2">
                ✓ Guanyador: ${partido.ganador.nombre}
            </div>
        `;
        return partidoDiv;
    }

    // Partit pendent de resultat
    if (configuracion.modoResultado === 'marcador') {
        // Mode marcador
        partidoDiv.innerHTML = `
            <div class="mb-3">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-medium">${partido.equipo1.nombre}</span>
                    <input type="number" min="0" 
                           class="w-16 px-2 py-1 border border-gray-300 rounded text-center marcador-input" 
                           data-equipo="1"
                           placeholder="0">
                </div>
            </div>
            ${partido.equipo2 ? `
            <div class="mb-3">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-medium">${partido.equipo2.nombre}</span>
                    <input type="number" min="0" 
                           class="w-16 px-2 py-1 border border-gray-300 rounded text-center marcador-input" 
                           data-equipo="2"
                           placeholder="0">
                </div>
            </div>
            ` : ''}
            <button class="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded mt-2 btn-registrar-marcador">
                Registrar resultat
            </button>
        `;

        // Event listener pel boto
        const btnRegistrar = partidoDiv.querySelector('.btn-registrar-marcador');
        btnRegistrar.addEventListener('click', () => registrarMarcador(indexRonda, indexPartido));

    } else {
        // Modo seleccio
        partidoDiv.innerHTML = `
            <div class="mb-2">
                <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input type="radio" name="ganador-${indexRonda}-${indexPartido}" value="1" class="mr-2">
                    <span class="font-medium">${partido.equipo1.nombre}</span>
                </label>
            </div>
            ${partido.equipo2 ? `
            <div class="mb-2">
                <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input type="radio" name="ganador-${indexRonda}-${indexPartido}" value="2" class="mr-2">
                    <span class="font-medium">${partido.equipo2.nombre}</span>
                </label>
            </div>
            ` : ''}
            <button class="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded mt-2 btn-registrar-seleccion">
                Registrar guanyador
            </button>
        `;

        // Event listener pel boto
        const btnRegistrar = partidoDiv.querySelector('.btn-registrar-seleccion');
        btnRegistrar.addEventListener('click', () => registrarSeleccion(indexRonda, indexPartido));
    }

    return partidoDiv;
}

// Registrar marcador
function registrarMarcador(indexRonda, indexPartido) {
    const partidoDiv = document.querySelector(`[data-ronda="${indexRonda}"][data-partido="${indexPartido}"]`);
    const inputs = partidoDiv.querySelectorAll('.marcador-input');

    const puntos1 = parseInt(inputs[0].value);
    const puntos2 = inputs[1] ? parseInt(inputs[1].value) : -1;

    if (isNaN(puntos1) || (inputs[1] && isNaN(puntos2))) {
        alert('Si us plau, introdueix els marcadors vàlids');
        return;
    }

    if (inputs[1] && puntos1 === puntos2) {
        alert('No pot haver empat en un torneig eliminatori');
        return;
    }

    const partido = bracket[indexRonda][indexPartido];
    partido.puntos1 = puntos1;
    partido.puntos2 = puntos2 >= 0 ? puntos2 : null;

    if (!inputs[1] || puntos1 > puntos2) {
        partido.ganador = partido.equipo1;
    } else {
        partido.ganador = partido.equipo2;
    }

    avanzarGanador(indexRonda, indexPartido);
    renderizarBracket();

    // Verificar si hi ha campio
    verificarCampeon();
}

// Registrar seleccio
function registrarSeleccion(indexRonda, indexPartido) {
    const partidoDiv = document.querySelector(`[data-ronda="${indexRonda}"][data-partido="${indexPartido}"]`);
    const radioSeleccionado = partidoDiv.querySelector('input[type="radio"]:checked');

    if (!radioSeleccionado) {
        alert('Si us plau, selecciona un guanyador');
        return;
    }

    const partido = bracket[indexRonda][indexPartido];
    const equipoGanador = radioSeleccionado.value === '1' ? partido.equipo1 : partido.equipo2;

    partido.ganador = equipoGanador;

    avanzarGanador(indexRonda, indexPartido);
    renderizarBracket();

    // Verificar si hi ha campio
    verificarCampeon();
}

// Avançar guanyador a la següent ronda
function avanzarGanador(indexRonda, indexPartido) {
    const partido = bracket[indexRonda][indexPartido];

    if (indexRonda < bracket.length - 1) {
        const siguienteRonda = bracket[indexRonda + 1];
        const siguientePartidoIndex = Math.floor(indexPartido / 2);
        const esPrimerEquipo = indexPartido % 2 === 0;

        if (esPrimerEquipo) {
            siguienteRonda[siguientePartidoIndex].equipo1 = partido.ganador;
        } else {
            siguienteRonda[siguientePartidoIndex].equipo2 = partido.ganador;
        }
    }
}

// Verificar si hi ha campio
function verificarCampeon() {
    const ultimaRonda = bracket[bracket.length - 1];
    const finalPartido = ultimaRonda[0];

    if (finalPartido.ganador) {
        setTimeout(() => {
            alert(`CAMPIÓ: ${finalPartido.ganador.nombre}!`);
        }, 300);
    }
}

// Mostrar una seccio i amagar les altres
function mostrarSeccion(idSeccion) {
    document.getElementById('seccion-config').classList.add('hidden');
    document.getElementById('seccion-nombres').classList.add('hidden');
    document.getElementById('seccion-torneo').classList.add('hidden');
    document.getElementById(idSeccion).classList.remove('hidden');
}

// Reiniciar tot
function reiniciarTodo() {
    if (confirm('Estàs segur que vols reiniciar el torneig? Es perdran tots els resultats.')) {
        configuracion = {
            numEquipos: 0,
            numEquiposAjustado: 0,
            tipoNombres: 'numeros',
            modoResultado: 'marcador',
            numByes: 0
        };
        equipos = [];
        bracket = [];
        document.getElementById('num-equipos').value = '';
        document.getElementById('aviso-byes').classList.add('hidden');

        mostrarSeccion('seccion-config');
    }
}