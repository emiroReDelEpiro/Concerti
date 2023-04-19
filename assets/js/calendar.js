document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var createEventButton = document.getElementById('AddEvent');

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
                end: '2023-03-25T13:00:00',
                description: 'Questo è un evento molto importante che non devi perdere',
                extendedProps: {
                    dettagli: 'L\'evento si terrà presso l\'Hotel XYZ'
                }
            }
        ],
        eventClick: function (info) {
            var popupEl = document.getElementById('popup');
            popupEl.style.display = 'block';

            var titleEl = popupEl.querySelector('h3');
            titleEl.innerHTML = info.event.title;

            var descriptionPop = popupEl.querySelector('p');
            descriptionPop.innerHTML = info.event.extendedProps.description;

            descriptionPop.innerHTML += info.event.extendedProps.dettagli != undefined ? "<br>" + "Dettagli: " + info.event.extendedProps.dettagli : "";

            descriptionPop.innerHTML += "<br>Inizio: " + info.event.start;

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

    createEventButton.addEventListener("click", async (e) => {
        e.preventDefault()

        const dataInizio = document.getElementById("data-inizio");
        const dataFine = document.getElementById("data-fine");

        dataInizio.addEventListener("change", () => {
            const dataInizioVal = new Date(dataInizio.value);
            const dataFineVal = new Date(dataFine.value);

            if (dataFineVal <= dataInizioVal) {
                dataFineVal.setDate(dataInizioVal.getDate() + 1);
                dataFine.value = dataFineVal.toISOString().slice(0, 10);
            }
        });


        var myHeaders = new Headers();
        myHeaders.append("Authorization", "token 12488864-7947-4ac5-9eea-e3cbf3434e6f");
        myHeaders.append("Content-Type", "application/json");

        var raw = {
            "title": document.getElementById("titolo").value,
            "location": document.getElementById("luogo").value,
            "startsAt": document.getElementById("data-inizio").value,
            "endsAt": document.getElementById("data-fine").value,
            "description": document.getElementById("description").value
        };

        var actualDate = new Date(document.getElementById("data-fine").value);
        actualDate.setDate(actualDate.getDate());

        var fullCalendarDate = {
            "title": document.getElementById("titolo").value,
            "start": document.getElementById("data-inizio").value,
            "end": actualDate,
            "description": document.getElementById("luogo").value + " " + document.getElementById("description").value
        }

        let data = JSON.stringify(raw);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: data,
            redirect: 'follow'
        };

        await fetch("https://events.abattaglia.it/api/event/create", requestOptions)
            .then(response => response.text())
            .then(result => {/*console.log(result)*/ })
            .catch(error => console.log('error', error));

        console.log(raw);

        calendar.addEvent(fullCalendarDate);
    });

    calendar.render();
});