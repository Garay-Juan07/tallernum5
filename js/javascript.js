
const calendarTitle = document.getElementById('calendar-title');
const calendarBody = document.getElementById('calendar-body');
const eventModal = document.getElementById('event-modal');
const eventDate = document.getElementById('event-date');
const eventTime = document.getElementById('event-time');
const eventDescription = document.getElementById('event-description');
const eventParticipants = document.getElementById('event-participants');
const modalTitle = document.getElementById('modal-title');

let currentDate = new Date();
let currentView = 'monthly';
let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
let selectedDate;

function populateEventTimeOptions() {
    for (let hour = 0; hour < 24; hour++) {
        for (let minute of ["00", "30"]) {
            const option = document.createElement('option');
            option.value = `${hour.toString().padStart(2, '0')}:${minute}`;
            option.text = `${hour.toString().padStart(2, '0')}:${minute}`;
            eventTime.appendChild(option);
        }
    }
}

populateEventTimeOptions();

function updateCalendar() {
    calendarBody.innerHTML = '';
    if (currentView === 'monthly') {
        updateMonthlyView();
    } else if (currentView === 'yearly') {
        updateYearlyView();
    } else if (currentView === 'daily') {
        updateDailyView();
    }
}

function updateMonthlyView() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    calendarTitle.innerText = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        calendarBody.appendChild(emptyDiv);
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
        dayElement.onclick = () => openModal(dateKey);
        calendarBody.appendChild(dayElement);
    }
}

function updateYearlyView() {
    const year = currentDate.getFullYear();
    calendarTitle.innerText = `${year}`;
    calendarBody.style.gridTemplateColumns = 'repeat(3, 1fr)';

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
            updateCalendar();
        };
        calendarBody.appendChild(monthElement);
    }
}

function updateDailyView() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    const dateKey = `${year}-${month + 1}-${day}`;
    calendarTitle.innerText = `${day} de ${currentDate.toLocaleString('default', { month: 'long' })}, ${year}`;
    calendarBody.style.gridTemplateColumns = '1fr';

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
    calendarBody.appendChild(dayElement);
}

function prev() {
    if (currentView === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() - 1);
    } else if (currentView === 'yearly') {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
    } else if (currentView === 'daily') {
        currentDate.setDate(currentDate.getDate() - 1);
    }
    updateCalendar();
}

function next() {
    if (currentView === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (currentView === 'yearly') {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
    } else if (currentView === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
    }
    updateCalendar();
}

function showMonthlyView() {
    currentView = 'monthly';
    calendarBody.style.gridTemplateColumns = 'repeat(7, 1fr)';
    updateCalendar();
}

function showYearlyView() {
    currentView = 'yearly';
    calendarBody.style.gridTemplateColumns = 'repeat(3, 1fr)';
    updateCalendar();
}

function showDailyView() {
    currentView = 'daily';
    calendarBody.style.gridTemplateColumns = '1fr';
    updateCalendar();
}

function openModal(dateKey) {
    selectedDate = dateKey;
    modalTitle.innerText = `Gestionar Evento para ${new Date(dateKey).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    if (events[dateKey]) {
        eventDate.value = dateKey;
        eventTime.value = events[dateKey].time;
        eventDescription.value = events[dateKey].description;
        eventParticipants.value = events[dateKey].participants;
    } else {
        eventDate.value = dateKey;
        eventTime.value = "00:00";
        eventDescription.value = '';
        eventParticipants.value = '';
    }
    eventModal.style.display = 'flex';
}

function closeModal() {
    eventModal.style.display = 'none';
}

function saveEvent() {
    const event = {
        date: selectedDate,
        time: eventTime.value,
        description: eventDescription.value.trim(),
        participants: eventParticipants.value.trim()
    };
    events[selectedDate] = event;
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    closeModal();
    updateCalendar();
}

function deleteEvent() {
    delete events[selectedDate];
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    closeModal();
    updateCalendar();
}

updateCalendar();
