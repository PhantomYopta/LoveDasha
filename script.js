document.addEventListener('DOMContentLoaded', () => {
    const calendarPage = document.getElementById('calendar-page');
    const mainPage = document.getElementById('main-page');
    const calendarButton = document.getElementById('calendar-button');
    const homeButton = document.getElementById('home-button');

    const modal = document.getElementById('event-modal');
    const closeModal = document.getElementById('close-modal');
    const eventNameInput = document.getElementById('event-name');
    const deleteEventButton = document.getElementById('delete-event');
    const daysCounter = document.getElementById('days-counter');

    let events = JSON.parse(localStorage.getItem('events')) || {}; // Получаем события из localStorage

    const startDate = new Date(2024, 11, 15); // 15 декабря 2024 года
    function updateDaysCounter() {
        const currentDate = new Date();
        const diffTime = currentDate - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        daysCounter.textContent = diffDays >= 0 ? diffDays : 0;
    }
    updateDaysCounter();

    calendarButton.addEventListener('click', () => {
        mainPage.classList.add('hidden');
        calendarPage.classList.remove('hidden');
    });

    homeButton.addEventListener('click', () => {
        calendarPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    deleteEventButton.addEventListener('click', () => {
        const selectedDate = modal.dataset.date;
        if (selectedDate && events[selectedDate]) {
            delete events[selectedDate]; // Удаляем событие
            localStorage.setItem('events', JSON.stringify(events)); // Сохраняем в localStorage
            generateCalendar(currentDate);  // Обновляем календарь
            modal.style.display = 'none';  // Закрываем модальное окно
        }
    });

    function openModal(date) {
        modal.style.display = 'flex';
        modal.dataset.date = date;
        const event = events[date];
        eventNameInput.value = event || '';  // Вставляем название события в инпут
        eventNameInput.readOnly = !!event;  // Если событие есть, инпут только для чтения
        deleteEventButton.style.display = event ? 'block' : 'none';  // Показываем кнопку удаления только если событие есть
    }

    const currentMonthElement = document.getElementById('current-month');
    const calendarBody = document.querySelector('#calendar tbody');
    let currentDate = new Date();

    // Генерация календаря
    function generateCalendar(date) {
        calendarBody.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();
        currentMonthElement.textContent = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let row = document.createElement('tr');

        for (let i = 0; i < firstDay; i++) {
            row.appendChild(document.createElement('td'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('td');
            cell.textContent = day;

            const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // Проверяем, если дата меньше 15 декабря 2024 года, то не выделять сердечком
            const dateObj = new Date(year, month, day);
            if (dateObj >= startDate) {
                if (day === 15) {
                    cell.classList.add('heart-day'); // Отметка для 15 декабря и позже
                }
            }

            // Подсвечиваем дни с событиями
            if (events[formattedDate]) {
                cell.classList.add('event-day');
                cell.title = events[formattedDate];  // Показываем событие при наведении
            }

            // Обработчик для открытия модального окна
            cell.addEventListener('click', () => openModal(formattedDate));

            row.appendChild(cell);

            if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
                calendarBody.appendChild(row);
                row = document.createElement('tr');
            }
        }
    }

    // Переход между месяцами
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });

    // Обработчик добавления события
    document.getElementById('event-form').addEventListener('submit', (e) => {
        e.preventDefault(); // Не отправляем форму, чтобы не было перезагрузки страницы
        const selectedDate = modal.dataset.date;
        const eventName = eventNameInput.value.trim();

        if (eventName) {
            events[selectedDate] = eventName;  // Добавляем событие
            localStorage.setItem('events', JSON.stringify(events));  // Сохраняем в localStorage
            generateCalendar(currentDate);  // Обновляем календарь
            modal.style.display = 'none';  // Закрываем модальное окно
        }
    });

    generateCalendar(currentDate); // Генерируем календарь при загрузке страницы
});
