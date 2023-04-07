document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'it',
        initialView: 'dayGridMonth',
        headerToolbar: {
            start: 'title',
            center: '',
            end: 'today prev,next'
        },
        events: [
            {
                title: 'Evento 1',
                start: '2023-03-01',
                description: 'Questo è un evento molto importante che non devi perdere',
            },
            {
                title: 'Evento 2',
                start: '2023-03-05',
                end: '2023-03-07',
                description: 'Questo è un evento molto importante che non devi perdere',

            },
            {
                title: 'Evento 3',
                start: '2023-03-09T12:30:00',
                allDay: false,
                url: "https://google.com",
                description: "important event"
            },
            {
                title: 'Evento 5',
                start: '2023-03-25T10:00:00',
                description: 'Questo è un evento molto importante che non devi perdere',
                extendedProps: {
                    dettagli: 'L\'evento si terrà presso l\'Hotel XYZ'
                }
            }
        ],
        eventClick: function(info) {
            var popupEl = document.getElementById('popup');
            popupEl.style.display = 'block';

            var titleEl = popupEl.querySelector('h3');
            titleEl.innerHTML = info.event.title;

            var descriptionPop = popupEl.querySelector('p');
            descriptionPop.innerHTML = info.event.extendedProps.description;

            descriptionPop.innerHTML+= info.event.extendedProps.dettagli != undefined ? "<br>" + "Dettagli: " + info.event.extendedProps.dettagli : "";

            descriptionPop.innerHTML+= "<br>Inizio: " + info.event.start;

            var closeButtonEl = document.querySelector('.btn-close');
            closeButtonEl.addEventListener('click', function () {
                popupEl.style.display = 'none';
            });

            window.addEventListener('click', function (event) {
                if (event.target == popupEl) {
                    popupEl.style.display = 'none';
                }
            });
        }
    });

    calendar.render();
});
