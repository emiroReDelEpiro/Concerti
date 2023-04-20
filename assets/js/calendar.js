let isAdmin = true;

document.addEventListener('DOMContentLoaded', () => {

    var calendarEl = document.getElementById('calendar');
    var createEventButton = document.getElementById('AddEvent');
    
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "token 35261b94-a221-410c-8167-ac226f010661");
    myHeaders.append("Content-Type", "application/json");

    if(isAdmin){
        document.getElementById('showAddEventPage').style.display = "block";
    }

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

            descriptionPop.innerHTML += "<br>Inizio: " + info.event.start

            var closeButtonEl = document.querySelector('.btn-close');

            closeButtonEl.addEventListener('click', function () {
                popupEl.style.display = 'none';
            });
            
            var deleteEventButton = document.getElementById('btn-delete-event');
      
            deleteEventButton.addEventListener('click', function () {
            
                if (isAdmin) {
                    //if (confirm("Sei sicuro di voler eliminare l'evento?")) {
                        popupEl.style.display = 'none';

                        var requestOptions = {
                            method: 'DELETE',
                            headers: myHeaders,
                            redirect: 'follow'
                        };
                        console.log(info);
                        fetch("https://events.abattaglia.it/api/event/"+ info.event.id , requestOptions)
                            .then(response => response.text())
                            .then(() => info.event.remove())
                            .catch(error => console.log('error', error));
                    //}
                }
            });

            window.addEventListener('click', function (event) {
                if (event.target == popupEl) {
                    popupEl.style.display = 'none';
                }
            });
        },
    });
    
    createEventButton.addEventListener("click", async (e) => {
        e.preventDefault()
        
        var startsAt = new Date(document.getElementById("data-inizio").value);
        var endsAt = new Date(document.getElementById("data-fine").value);
        
        if (startsAt >= endsAt) {
            endsAt.setDate(startsAt.getDate() + 1);
        }

        var raw = {
            "title": document.getElementById("titolo").value,
            "location": document.getElementById("luogo").value,
            "startsAt": startsAt.toISOString().slice(0, 19),
            "endsAt": endsAt.toISOString().slice(0, 19),
        };

        let data = JSON.stringify(raw);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: data,
            redirect: 'follow'
        };
    
        await fetch("https://events.abattaglia.it/api/event/create", requestOptions)
            .then(response => response.text())
            .then(result => {
                
                let data = JSON.parse(result);
                
                console.log(data.id + "" + data);

                var actualDate = new Date(document.getElementById("data-fine").value);
                actualDate.setDate(actualDate.getDate());
            
                var fullCalendarEvent = {
                    title: document.getElementById("titolo").value,
                    start: document.getElementById("data-inizio").value,
                    id: data.id,
                    end: actualDate,
                    description: "Location: " + document.getElementById("luogo").value,
                };
                
                calendar.addEvent(fullCalendarEvent);
            })
            .catch(error => console.log('error', error));
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
                    var actualDate = new Date(event.endsAt);
                    actualDate.setDate(actualDate.getDate() + 1);

                    const newEvent = {
                        title: event.title,
                        start: event.startsAt,
                        end: actualDate,
                        id: event.id,
                        description: event.description
                    };
                    return newEvent;
                });

                data.forEach(element => {
                    calendar.addEvent(element);
                })

                display(data);

                document.getElementById("orderBy").addEventListener("change", () => {
                    let valueOrder = document.getElementById("orderBy").value;
            
                    document.getElementById("box").innerHTML = "";
            
                    data = orderArrayBy(data, valueOrder);
            
                    display(data);
                })
                
                document.getElementById('form').addEventListener("submit", e =>{
                    e.preventDefault();
                
                    let filtered = data.filter(search);
                
                    document.getElementById("box").innerHTML = "";
                
                    if (filtered.length === 0) {
                        let noResults = document.createElement("div");
                        noResults.innerHTML = "Nessun risultato trovato";
                        noResults.classList.add("no-results");
                        document.getElementById("box").append(noResults);
                    } else {
                        display(filtered);
                    }
                })                

            })
            .catch(error => console.log('error', error));

    } catch (error) {
        console.log("something went wrong " + error);
    }

    calendar.render();

    //eventi = orderArrayBy(eventi, "alfabeto");

    function display(p1) {
        p1.forEach(element => {
            let cartello = document.createElement("div");
            cartello.classList.add("cartello");

            let titolo = document.createElement("div");

            let nome = document.createElement("div");
            nome.classList.add("cartelloNome");;
            nome.innerHTML = element.title;

            let luogo = document.createElement("div");
            luogo.classList.add("cartelloLuogo");
            luogo.innerHTML = element.description;

            let data = document.createElement("div");
            data.classList.add("cartelloData");
            data.innerHTML = element.start + "/" + element.end;

            let descrizione = document.createElement("div");
            descrizione.classList.add("cartelloDescrizione");
            descrizione.innerHTML = element.description;

            let box = document.getElementById("box");

            titolo.appendChild(nome);
            titolo.appendChild(descrizione);
            cartello.appendChild(titolo);
            cartello.appendChild(data);
            cartello.appendChild(luogo);
            box.appendChild(cartello);
        });
    }



    //ORDER BY
    

    function orderArrayBy(p1, p2) {
        switch (p2) {
            case "alfabeto":
                return p1.sort((x, y) => {
                    if (x.title < y.title) return -1;
                    if (x.title > y.title) return 1;
                    return 0;
                });
            case "alfabetoInverso":
                return p1.sort((x, y) => {
                    if (x.title > y.title) return -1;
                    if (x.title < y.title) return 1;
                    return 0;
                });
            case "dataCrescente":
                return p1.sort((x, y) => {
                    if (x.start < y.start) return -1;
                    if (x.start > y.start) return 1;
                    return 0;
                });
            case "dataDecrescente":
                return p1.sort((x, y) => {
                    if (x.start > y.start) return -1;
                    if (x.start < y.start) return 1;
                    return 0;
                });
            case "location":
                return p1.sort((x, y) => {
                    if (x.description < y.description) return -1;
                    if (x.description > y.description) return 1;
                    return 0;
                });
        }
    }

    function search(value) {
        return value.title.toLowerCase().includes(document.getElementById("barraDiRicerca").value.toLowerCase());
    }

});