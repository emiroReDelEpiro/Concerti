
document.addEventListener('DOMContentLoaded', () => {

    var isAdmin = document.getElementById("varDiv").getAttribute("data-var");

    if (isAdmin == null || isAdmin.trim() === ''){
        isAdmin = false;
    }

    const calendarEl = document.getElementById('calendar');
    const createEventButton = document.getElementById('AddEvent');
    const closeEventButton = document.getElementById('CloseAddEvent');
    
    const myHeaders = new Headers({
        Authorization: 'token 35261b94-a221-410c-8167-ac226f010661',
        'Content-Type': 'application/json',
    });

    var dynamicList = [];

    if (isAdmin) {
        document.getElementById('showAddEventPage').style.display = "block";
    }else{
        document.getElementById('showAddEventPage').style.display = "none";
    }

    try {
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://events.abattaglia.it/api/event/list", requestOptions)
            .then(response => response.text())
            .then(result => {
                let data = JSON.parse(result);

                dynamicList = data;

                data = data.map(event => {
                    var actualDate = new Date(event.endsAt);
                    actualDate.setDate(actualDate.getDate());

                    const newEvent = {
                        title: event.title,
                        start: event.startsAt,
                        end: actualDate,
                        id: event.id,
                        location: event.location
                    };
                    return newEvent;
                });

                data.forEach(element => {
                    calendar.addEvent(element);
                })

                display(dynamicList);

                document.getElementById("orderBy").addEventListener("change", () => {
                    let valueOrder = document.getElementById("orderBy").value;

                    document.getElementById("box").innerHTML = "";

                    dynamicList = orderArrayBy(dynamicList, valueOrder);

                    display(dynamicList);
                })

                document.getElementById('form').addEventListener("submit", e => {
                    e.preventDefault();

                    let filtered = dynamicList.filter(search);

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

        const calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'it',
            initialView: 'dayGridMonth',
            headerToolbar: {
                start: 'title',
                center: '',
                end: 'today prev,next'
            },
            eventClick: function (info) {
                const popupEl = document.getElementById('popup');
                const titleEl = popupEl.querySelector('h3');
                const descriptionPop = popupEl.querySelector('p');
                const deleteEventButton = document.getElementById('btn-delete-event');
                
                if (isAdmin) {
                    deleteEventButton.style.display = "block";
                } else {
                    deleteEventButton.style.display = "none";
                }
            
                popupEl.style.display = 'block';
            
                titleEl.textContent = info.event.title;
            
                
                descriptionPop.innerHTML = "";

                descriptionPop.innerHTML = info.event.extendedProps.location != undefined ? "<div>Location: " + info.event.extendedProps.location + "</div>": "";

                descriptionPop.innerHTML += "<div>" + "Data: " + String(info.event.start).split(" ")[0]+"/"+
                                                String(info.event.start).split(" ")[2] +"/"+
                                                String(info.event.start).split(" ")[3]+ "</div>"

            
                deleteEventButton.addEventListener('click', function () {
                    if (isAdmin) {
                        popupEl.style.display = 'none';
            
                        const requestOptions = {
                            method: 'DELETE',
                            headers: myHeaders,
                            redirect: 'follow'
                        };
            
                        fetch("https://events.abattaglia.it/api/event/" + info.event.id, requestOptions)
                            .then(response => response.text())
                            .then(() => {
                                const index = dynamicList.findIndex(event => event.id === info.event.id);
                                if (index !== -1) {
                                    dynamicList.splice(index, 1);
                                    display(dynamicList);
                                }
                                info.event.remove();
                            })
                            .catch(error => console.log('error', error));
                    }
                });
            
                window.addEventListener('click', function (event) {
                    if (event.target === popupEl) {
                        popupEl.style.display = 'none';
                    }
                });
            },
        });

        createEventButton.addEventListener("click", async (e) => {
            e.preventDefault()


            var startsAt = new Date(document.getElementById("data-inizio").value);
            var endsAt = new Date(document.getElementById("data-fine").value);

            if(String(startsAt) == "Invalid Date") return ;
            else if(String(startsAt) == "Invalid Date") return ;
            else if(document.getElementById("titolo").value == "") return ;
            else if(document.getElementById("luogo").value == "") return ;

            if (startsAt >= endsAt) {
                endsAt.setDate(startsAt.getDate() + 1);
            }

            const raw = {
                "title": document.getElementById("titolo").value,
                "location": document.getElementById("luogo").value,
                "startsAt": startsAt.toISOString().slice(0, 19),
                "endsAt": endsAt.toISOString().slice(0, 19),
            };

            let data = JSON.stringify(raw);

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: data,
                redirect: 'follow'
            };

            await fetch("https://events.abattaglia.it/api/event/create", requestOptions)
                .then(response => response.text())
                .then(result => {

                    let data = JSON.parse(result);

                    let actualDate = new Date(document.getElementById("data-fine").value);
                    actualDate.setDate(actualDate.getDate());

                    const fullCalendarEvent = {
                        title: document.getElementById("titolo").value,
                        start: document.getElementById("data-inizio").value,
                        id: data.id,
                        end: actualDate,
                        description: "Location: " + document.getElementById("luogo").value,
                    };

                    calendar.addEvent(fullCalendarEvent);

                    dynamicList.push(fullCalendarEvent);
                    display(dynamicList);

                })
                .catch(error => console.log('error', error));

                document.getElementById("titolo").value = "";
                document.getElementById("luogo").value = "";
                document.getElementById("data-inizio").value = "";
                document.getElementById("data-fine").value = "";
        });

        closeEventButton.addEventListener("click", async (e) => {
            e.preventDefault()
            document.getElementById("titolo").value = "";
            document.getElementById("luogo").value = "";
            document.getElementById("data-inizio").value = "";
            document.getElementById("data-fine").value = "";
        })

        calendar.render();

    } catch (error) {
        throw new Error("Something went wrong " + error);
    }

    function display(p1) {
        const box = document.getElementById("box");

        box.innerHTML = "";

        p1.forEach(element => {
            const cartello = document.createElement("div");
            const titolo = document.createElement("div");
            const nome = document.createElement("div");
            const luogo = document.createElement("div");
            const data = document.createElement("div");

            cartello.classList.add("cartello");

            nome.classList.add("cartelloNome");;
            nome.innerHTML = element.title;

            luogo.classList.add("cartelloLuogo");
            luogo.innerHTML = element.location;

            data.classList.add("cartelloData");
            data.innerHTML = element.startsAt + "/" + element.endsAt;

            titolo.appendChild(nome);
            cartello.appendChild(titolo);
            cartello.appendChild(data);
            cartello.appendChild(luogo);
            box.appendChild(cartello);
        });
    }

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