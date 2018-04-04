function clientInterfaceCtrl($state, $transitions, AuthService, mySocket) {

    const that = this;

    this.filter = {};
    this.eventForm = {};
    this.editEventForm = {};
    this.isEventRegistration = true;

    const getEvents = () => {
        mySocket.emit('getEvents');
        mySocket.on('retrieveEvents', (events) => {
            this.events = events.events;
        });
    };

    getEvents();

    this.currentUser = AuthService.isLoggedIn().user;
    this.eventPreloader = false;

    /* MENU FUNCTIONS */

    this.toggleMenu = () => {
        const eventForm = document.querySelector('.new-event-wrapper');
        eventForm.classList.toggle('enter');
        this.isEventRegistration = true;
    };

    this.openMenu = () => {
        const eventForm = document.querySelector('.new-event-wrapper');
        eventForm.classList.add('enter');
    };

    this.closeMenu = () => {
        const eventForm = document.querySelector('.new-event-wrapper');
        eventForm.classList.remove('enter');
    };

    $(function () {
        $("#date-from").datepicker({
            dateFormat: "dd.mm.yy",
            onSelect: function () {
                that.eventForm.dateFrom = this.value;
            }
        });

        $("#date-to").datepicker({
            dateFormat: "dd.mm.yy",
            onSelect: function () {
                that.eventForm.dateTo = this.value;
            }
        });
    });

    this.switchCardInterface = (e) => {
        let activeTab = e.currentTarget.parentElement.querySelector('.event-button-active');

        const long_row = e.currentTarget.parentElement.nextElementSibling;

        if (e.currentTarget.getAttribute('data-id') === "info") {
            activeTab.classList.remove('event-button-active');
            activeTab = e.currentTarget;
            activeTab.classList.add('event-button-active');
            long_row.style.transform = "translateX(0)"
        }
        if (e.currentTarget.getAttribute('data-id') === "description") {
            activeTab.classList.remove('event-button-active');
            activeTab = e.currentTarget;
            activeTab.classList.add('event-button-active');
            long_row.style.transform = "translateX(-33.3333333333%)"
        }
        if (e.currentTarget.getAttribute('data-id') === "comments") {
            activeTab.classList.remove('event-button-active');
            activeTab = e.currentTarget;
            activeTab.classList.add('event-button-active');
            long_row.style.transform = "translateX(-66.6666666666%)"
        }
    };

    this.addEvent = (e) => {
        e.preventDefault();
        this.eventPreloader = true;

        if (this.eventForm['tags']) {
            this.eventForm.tags = this.eventForm.tags.split(',').map(str => str.trim());
        } else {
            this.eventForm.tags = [];
        }


        if (this.eventForm['creators']) {
            this.eventForm.creators = this.eventForm.creators.split(',');
            this.eventForm.creators.push(this.currentUser.email);
            this.eventForm.creators = this.eventForm.creators.map(str => str.trim());
        } else {
            this.eventForm.creators = [];
            this.eventForm.creators.push(this.currentUser.email);
        }


        const event = this.eventForm;

        mySocket.emit('addEvent', event);
    };

    mySocket.on('retrieveNewEvent', (data) => {
        this.eventPreloader = false;
        this.events.push(data.event);
    })

    this.showMyEvents = () => {
        this.filter.input = this.currentUser.email;
    };

    this.toggleEditEvent = (event) => {
        this.eventForm = Object.assign({}, event);
        this.isEventRegistration = false;
        this.openMenu();
    };

    this.editEvent = (e) => {
        e.preventDefault();

        this.eventPreloader = true;

        const inputs = document.querySelectorAll('.form-input');

        inputs.forEach((input) => {
            if (input.classList.contains('ng-dirty')) {
                let model = input.getAttribute('ng-model').split('.');
                model = model[model.length - 1];
                this.editEventForm[model] = input.value;
            }

        });

        if (this.editEventForm['tags']) {
            this.editEventForm.tags = this.eventForm.tags.split(',').map(str => str.trim());
        }

        if (this.editEventForm['creators']) {
            this.editEventForm.creators = this.eventForm.creators.split(',').map(str => str.trim());
        }

        this.editEventForm['_id'] = this.eventForm._id;

        const event = this.editEventForm;

        mySocket.emit('editEvent', event);

        // mySocket.on('retrieveEditedEvent', (data) => {
        //
        //     this.eventPreloader = false;
        //     this.events.forEach((event, index) => {
        //         if (event._id === data.event._id) {
        //             this.events[index] = data.event;
        //         }
        //     });
        // })
    };

    this.sendNewComment = (e, event) => {
        e.preventDefault();

        const date = new Date().toLocaleString('ru', {year: 'numeric',
            month: 'numeric',
            day: 'numeric',});

        const message = e.currentTarget.previousElementSibling.value;

        const comment = {
            id: event._id,
            date: date,
            author: this.currentUser.name,
            comment: message
        };

        mySocket.emit('sendNewComment', comment);

        // mySocket.on('retrieveEvent', (data) => {
        //
        //     this.events.forEach((event, index) => {
        //         if (event._id === data.event._id) {
        //             this.events[index] = data.event;
        //         }
        //     });
        // })
    };

    mySocket.on('retrieveEvent', (data) => {

        this.events.forEach((event, index) => {
            this.eventPreloader = false;
            if (event._id === data.event._id) {
                this.events[index] = data.event;
            }
        });
    });

    this.logout = () => {
        AuthService.logOut();
    };
}

app.component('clientInterface', {
    controller: clientInterfaceCtrl,
    templateUrl: './app/clientInterface/clientInterfaceView.html'
});
