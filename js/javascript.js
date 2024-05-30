
const titulodelcalendario = document.getElementById('calendar-title');
const cuerpodelcalendario = document.getElementById('calendar-body');
const eventomodal = document.getElementById('event-modal');
const fecha = document.getElementById('event-date');
const tiempo = document.getElementById('event-time');
const descripcion = document.getElementById('event-description');
const participantes = document.getElementById('event-participants');
const titulo = document.getElementById('modal-title');

let currentDate = new Date();
let currentView = 'monthly';
let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
let selectedDate;

function opcionesdetiempo() {
    for (let hour = 0; hour < 24; hour++) {
        for (let minute of ["00", "30"]) {
            const option = document.createElement('option');
            option.value = `${hour.toString().padStart(2, '0')}:${minute}`;
            option.text = `${hour.toString().padStart(2, '0')}:${minute}`;
            tiempo.appendChild(option);
        }
    }
}

opcionesdetiempo();

function actualizarcalendario() {
    cuerpodelcalendario.innerHTML = '';
    if (currentView === 'monthly') {
        actualizacionmes();
    } else if (currentView === 'yearly') {
        actualizaranio();
    } else if (currentView === 'daily') {
        actualizardia();
    }
}

function actualizacionmes() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    titulodelcalendario.innerText = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        cuerpodelcalendario.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.innerText = day;
        const dateKey = `${year}-${month + 1}-${day}`;
        if (events[dateKey]) {
            dayElement.classList.add('event');
            dayElement.title = `${events[dateKey].description}\n${events[dateKey].participants}`;
        }
        if (day === currentDate.getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            dayElement.classList.add('today');
        }
        dayElement.onclick = () => abrir(dateKey);
        cuerpodelcalendario.appendChild(dayElement);
    }
}

function actualizaranio() {
    const year = currentDate.getFullYear();
    titulodelcalendario.innerText = `${year}`;
    cuerpodelcalendario.style.gridTemplateColumns = 'repeat(3, 1fr)';

    for (let month = 0; month < 12; month++) {
        const monthElement = document.createElement('div');
        monthElement.innerText = new Date(year, month).toLocaleString('default', { month: 'long' });
        monthElement.style.background = '#00ff00';
        monthElement.style.color = '#ffffff';
        monthElement.style.padding = '10px';
        monthElement.style.margin = '5px';
        monthElement.style.borderRadius = '5px';
        monthElement.onclick = () => {
            currentDate.setMonth(month);
            currentView = 'monthly';
            actualizarcalendario();
        };
        cuerpodelcalendario.appendChild(monthElement);
    }
}

function actualizardia() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    const dateKey = `${year}-${month + 1}-${day}`;
    titulodelcalendario.innerText = `${day} de ${currentDate.toLocaleString('default', { month: 'long' })}, ${year}`;
    cuerpodelcalendario.style.gridTemplateColumns = '1fr';

    const dayElement = document.createElement('div');
    dayElement.innerText = `Hoy es ${currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    dayElement.style.padding = '20px';
    dayElement.style.background = '#00ff00';
    dayElement.style.color = '#ffffff';
    dayElement.style.borderRadius = '5px';

    const eventText = events[dateKey] ? `Evento: ${events[dateKey].description}\nParticipantes: ${events[dateKey].participants}` : 'No hay eventos';
    const eventElement = document.createElement('div');
    eventElement.innerText = eventText;
    eventElement.style.color = 'black';
    eventElement.style.marginTop = '10px';

    dayElement.appendChild(eventElement);
    cuerpodelcalendario.appendChild(dayElement);
}

function previo() {
    if (currentView === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() - 1);
    } else if (currentView === 'yearly') {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
    } else if (currentView === 'daily') {
        currentDate.setDate(currentDate.getDate() - 1);
    }
    actualizarcalendario();
}

function siguiente() {
    if (currentView === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (currentView === 'yearly') {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
    } else if (currentView === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
    }
    actualizarcalendario();
}

function mes() {
    currentView = 'monthly';
    cuerpodelcalendario.style.gridTemplateColumns = 'repeat(7, 1fr)';
    actualizarcalendario();
}

function anio() {
    currentView = 'yearly';
    cuerpodelcalendario.style.gridTemplateColumns = 'repeat(3, 1fr)';
    actualizarcalendario();
}

function dia() {
    currentView = 'daily';
    cuerpodelcalendario.style.gridTemplateColumns = '1fr';
    actualizarcalendario();
}

function abrir(dateKey) {
    selectedDate = dateKey;
    titulo.innerText = `Gestionar Evento para ${new Date(dateKey).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    if (events[dateKey]) {
        fecha.value = dateKey;
        tiempo.value = events[dateKey].time;
        descripcion.value = events[dateKey].description;
        participantes.value = events[dateKey].participants;
    } else {
        fecha.value = dateKey;
        tiempo.value = "00:00";
        descripcion.value = '';
        participantes.value = '';
    }
    eventomodal.style.display = 'flex';
}

function cancelar() {
    eventomodal.style.display = 'none';
}

function guardar() {
    const event = {
        date: selectedDate,
        time: tiempo.value,
        description: descripcion.value.trim(),
        participants: participantes.value.trim()
    };
    events[selectedDate] = event;
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    cancelar();
    actualizarcalendario();
}

function eliminar() {
    delete events[selectedDate];
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    cancelar();
    actualizarcalendario();
}

actualizarcalendario();
