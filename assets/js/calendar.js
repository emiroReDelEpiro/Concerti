document.addEventListener('DOMContentLoaded', () => {

    var calendarEl = document.getElementById('calendar');
    var createEventButton = document.getElementById('AddEvent');

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "token 35261b94-a221-410c-8167-ac226f010661");

    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'it',
        initialView: 'dayGridMonth',
        headerToolbar: {
            start: 'title',
            center: '',
            end: 'today prev,next'
        },
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

        var raw = {
            "title": document.getElementById("titolo").value,
            "location": document.getElementById("luogo").value,
            "startsAt": document.getElementById("data-inizio").value,
            "endsAt": document.getElementById("data-fine").value,
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
            .then(result => { console.log(result) })
            .catch(error => console.log('error', error));

        calendar.addEvent(fullCalendarDate);
    });

    try {
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://events.abattaglia.it/api/event/list", requestOptions)
            .then(response => response.text())
            .then(result => {
                let data = JSON.parse(result); 

                data = data.map(event => {
                    const newEvent = {
                        title: event.title,
                        start: event.startsAt,
                        end: event.endsAt,
                        description: event.description
                    };
                    return newEvent;
                });

                data.forEach(element => {
                    calendar.addEvent(element);
                    console.log(element);
                })
            })
            .catch(error => console.log('error', error));

    } catch (error) {
        console.log("something went wrong " + error);
    }

    calendar.render();
});