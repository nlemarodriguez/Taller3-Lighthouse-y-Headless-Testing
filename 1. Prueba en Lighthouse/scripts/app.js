(function () {
    'use strict';

    var app = {
        isLoading: true,
        visibleCards: {},
        selectedTimetables: [],
        spinner: document.querySelector('.loader'),
        cardTemplate: document.querySelector('.cardTemplate'),
        container: document.querySelector('.main'),
        addDialog: document.querySelector('.dialog-container')
    };

    var db;

    //cargarDeSesion();
    cargarDeIndexDB();

    function cargarDeSesion() {
        let tablaEstaciones = sessionStorage.getItem('tabla');
        app.selectedTimetables = JSON.parse(tablaEstaciones);
    }

    function cargarDeIndexDB() {
        var request = window.indexedDB.open('estaciones', 1);

        request.onerror = function (event) {
            // Hacer algo con request.errorCode!
            alert("Error abriendo DB: " + event.target.errorCode);
        };
        request.onsuccess = function (event) {
            db = request.result;
            if (!app.selectedTimetables) {
                app.selectedTimetables = [];
            }
            console.log("Carga exitosa de BD:",db);
            var objectStore = db.transaction("estaciones").objectStore("estaciones");
            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;

                if (cursor) {

                    app.selectedTimetables.push({ key: cursor.value.key, label: cursor.value.label });
                    app.getSchedule(cursor.value.key, cursor.value.label);
                    cursor.continue();
                } else {
                    //alert("No more entries!");
                }

            };
        };

        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            var objectStore = db.createObjectStore("estaciones", { keyPath: "id", autoIncrement: true });
            //F1: Ingresar la estacion por defecto al indexdb
            objectStore.add({ key: 'metros/1/bastille/A', label: 'Bastille, Direction La Défense' })
            console.log("agregar por defecto:",objectStore);
        };
    }


    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/

    document.getElementById('butRefresh').addEventListener('click', function () {
        // Refresh all of the metro stations
        app.updateSchedules();
    });

    document.getElementById('butAdd').addEventListener('click', function () {
        // Open/show the add new station dialog
        app.toggleAddDialog(true);
    });

    document.getElementById('butAddCity').addEventListener('click', function () {


        var select = document.getElementById('selectTimetableToAdd');
        var selected = select.options[select.selectedIndex];
        var key = selected.value;
        var label = selected.textContent;
        if (!app.selectedTimetables) {
            app.selectedTimetables = [];
        }
        app.getSchedule(key, label);
        app.selectedTimetables.push({ key: key, label: label });
        app.toggleAddDialog(false);
        //guardarEnSesion(app.selectedTimetables);
        guardarEnIndexDB(key, label);
    });


    function guardarEnSesion(selectedTimetables) {
        const tabla = JSON.stringify(selectedTimetables);
        if (tabla) {
            sessionStorage.setItem('tabla', tabla);
        }
    }

    function guardarEnIndexDB(key, label) {
        var request = db.transaction(["estaciones"], "readwrite")
            .objectStore("estaciones")
            .add({ key: key, label: label });
    }

    document.getElementById('butAddCancel').addEventListener('click', function () {
        // Close the add new station dialog
        app.toggleAddDialog(false);
    });






    /*****************************************************************************
     *
     * Methods to update/refresh the UI
     *
     ****************************************************************************/

    // Toggles the visibility of the add new station dialog.
    app.toggleAddDialog = function (visible) {
        if (visible) {
            app.addDialog.classList.add('dialog-container--visible');
        } else {
            app.addDialog.classList.remove('dialog-container--visible');
        }
    };

    // Updates a timestation card with the latest weather forecast. If the card
    // doesn't already exist, it's cloned from the template.

    app.updateTimetableCard = function (data) {

        if (!data) {
            // There's no data, skip the update.
            return;
        }


        var key = data.key;
        var dataLastUpdated = new Date(data.created);
        var schedules = data.schedules;
        var card = app.visibleCards[key];



        if (!card) {
            var label = data.label.split(', ');
            var title = label[0];
            var subtitle = label[1];
            card = app.cardTemplate.cloneNode(true);
            card.classList.remove('cardTemplate');
            card.querySelector('.label').textContent = title;
            card.querySelector('.subtitle').textContent = subtitle;
            card.removeAttribute('hidden');
            app.container.appendChild(card);
            app.visibleCards[key] = card;
        }
        card.querySelector('.card-last-updated').textContent = data.created;

        var scheduleUIs = card.querySelectorAll('.schedule');
        for (var i = 0; i < 4; i++) {
            var schedule = schedules[i];
            var scheduleUI = scheduleUIs[i];
            if (schedule && scheduleUI) {
                scheduleUI.querySelector('.message').textContent = schedule.message;
            }
        }

        if (app.isLoading) {
            window.cardLoadTime = performance.now();
            app.spinner.setAttribute('hidden', true);
            app.container.removeAttribute('hidden');
            app.isLoading = false;
        }
    };

    /*****************************************************************************
     *
     * Methods for dealing with the model
     *
     ****************************************************************************/

    function getProgramacionFromInternet(key) {
        var url = 'https://api-ratp.pierre-grimaud.fr/v3/schedules/' + key;
        return fetch(url, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .catch(() => {
                return null;
            });
    }

    function getProgramacionFromCache(key) {
        if (!('caches' in window)) {
            return null;
        }
        var url = 'https://api-ratp.pierre-grimaud.fr/v3/schedules/' + key;
        return caches.match(url)
            .then((response) => {
                if (response) {
                    return response.json();
                }
                return null;
            })
            .catch((err) => {
                console.error('Error getting data from cache', err);
                return null;
            });
    }

    app.getSchedule = function (key, label) {

        getProgramacionFromInternet(key).then((responseJson) => {
            var result = {};
            result.key = key;
            result.label = label;
            result.created = responseJson._metadata.date;
            result.schedules = responseJson.result.schedules;
            app.updateTimetableCard(result);
            console.log("trayendo de internet:", result.key, "schedules:",JSON.stringify(result.schedules));
        }).catch((err) => {
            console.error('error trayendo de internet', err);
        });
        getProgramacionFromCache(key).then((responseJson) => {
            var result = {};
            result.key = key;
            result.label = label;
            result.created = responseJson._metadata.date;
            result.schedules = responseJson.result.schedules;
            console.log("trayendo de cache:", result.key, "schedules:",JSON.stringify(result.schedules));
            app.updateTimetableCard(result);
        }).catch((err) => {
            console.info('No esta disponible en cache');
        });
    };

    // Iterate all of the cards and attempt to get the latest timetable data
    app.updateSchedules = function () {
        var keys = Object.keys(app.visibleCards);
        keys.forEach(function (key) {
            app.getSchedule(key);
        });
    };

    /*
     * Fake timetable data that is presented when the user first uses the app,
     * or when the user has not saved any stations. See startup code for more
     * discussion.
     */

    var initialStationTimetable = {

        key: 'metros/1/bastille/A',
        label: 'Bastille, Direction La Défense',
        created: '2017-07-18T17:08:42+02:00',
        schedules: [
            {
                message: '0 mn'
            },
            {
                message: '2 mn'
            },
            {
                message: '5 mn'
            }
        ]


    };


    /************************************************************************
     *
     * Code required to start the app
     *
     * NOTE: To simplify this codelab, we've used localStorage.
     *   localStorage is a synchronous API and has serious performance
     *   implications. It should not be used in production applications!
     *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
     *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
     ************************************************************************/
    /* 
        if (app.selectedTimetables) {
            app.selectedTimetables.forEach(function (response) {
                app.getSchedule(response.key, response.label);
    
            })
    
        } else {
    
            app.getSchedule('metros/1/bastille/A', 'Bastille, Direction La Défense');
            app.selectedTimetables = [
                { key: initialStationTimetable.key, label: initialStationTimetable.label }
            ];
        } */
})();
