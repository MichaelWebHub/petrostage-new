function eventsInterfaceCtrl($state, $transitions, AuthService, mySocket) {
    console.log(this);

    this.filter = {};
    this.eventForm = {};
    this.editEventForm = {};
    this.isEventRegistration = true;
    this.askForDeleteEvent = false;
    this.showEventWrapper = false;
    this.showRatingForm = false;
    this.showArchived = false;

    this.currentYear = (new Date()).getFullYear();
    this.currentDate = new Date();

    const getEvents = () => {
        mySocket.emit('getEvents');
        mySocket.on('retrieveEvents', (events) => {
            this.events = events.events;
        });
    };

    getEvents();

    this.getEventDate = (event) => {
        return new Date(event.dateFrom);
    };

    this.expired = (event) => {
        const lastDay = new Date(event.dateTo)
        const expireDay = new Date(lastDay);
        expireDay.setDate(lastDay.getDate() + 2);

        if (this.showArchived) {
            return (expireDay < this.currentDate);
        } else {
            return (expireDay >= this.currentDate);
        }

    };

    this.showArchive = (event) => {
        this.showArchived = !this.showArchived;
        if (this.showArchived) {
            event.currentTarget.classList.add('tool-button-active');
        } else {
            event.currentTarget.classList.remove('tool-button-active');
        }
    };

    this.currentUserStatus = AuthService.isLoggedIn().status;
    this.currentUser = AuthService.isLoggedIn().user;

    /* MENU FUNCTIONS */

    this.toggleMenu = (event) => {
        const eventForm = document.querySelector('.new-event-wrapper');
        eventForm.classList.toggle('enter');
        this.isEventRegistration = true;
        this.showEventWrapper = !this.showEventWrapper;

        if (this.showEventWrapper && eventForm.classList.contains('enter')) {
            event.currentTarget.classList.add('tool-button-active');
        } else {
            event.currentTarget.classList.remove('tool-button-active');
        }
    };

    this.openMenu = () => {
        const activeButton = document.querySelector('.add-new-order');
        const eventForm = document.querySelector('.new-event-wrapper');
        eventForm.classList.add('enter');
        this.showEventWrapper = true;
    };

    this.closeMenu = () => {
        const eventForm = document.querySelector('.new-event-wrapper');
        const activeButton = document.querySelector('.add-new-order');
        eventForm.classList.remove('enter');
        activeButton.classList.remove('tool-button-active');
        this.eventForm = {};
    };

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

    // ADD EVENT

    this.addEvent = (e) => {
        e.preventDefault();
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


        if(this.eventForm['dateFrom']) {
            this.eventForm.dateFrom = new Date(this.eventForm.dateFrom).toLocaleString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'});
        }

        if(this.eventForm['dateTo']) {
            this.eventForm.dateTo = new Date(this.eventForm.dateTo).toLocaleString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'});
        }

        const event = this.eventForm;

        mySocket.emit('addEvent', event);

        this.closeMenu();
    };

    mySocket.on('retrieveNewEvent', (data) => {
        this.events.push(data.event);
    });

    this.showMyEvents = (event) => {
        if (this.filter.input === this.currentUser.email) {
            this.filter.input = '';
            event.currentTarget.classList.remove('tool-button-active');
        } else {
            this.filter.input = this.currentUser.email;
            event.currentTarget.classList.add('tool-button-active');
        }
    };

    this.clearFilter = () => {
        this.filter.input = '';
        const activeButton = document.querySelector('.show-my-events');
        activeButton.classList.remove('tool-button-active');
    };

    // DELETE EVENT

    this.toggleDeleteEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.askForDeleteEvent = !this.askForDeleteEvent;
    };

    this.deleteEvent = (e) => {
        e.preventDefault();

        const id = this.eventForm._id;
        mySocket.emit('deleteEvent', id);
        this.closeMenu();
        getEvents();
    };

    // EDIT EVENT

    this.toggleEditEvent = (event) => {
        this.eventForm = Object.assign({}, event);
        this.isEventRegistration = false;
        this.openMenu();
    };

    this.editEvent = (e) => {
        e.preventDefault();

        const inputs = document.querySelectorAll('.form-input');
        const datepickers = document.querySelectorAll('md-datepicker');

        inputs.forEach((input) => {
            if (input.classList.contains('ng-dirty')) {
                let model = input.getAttribute('ng-model').split('.');
                model = model[model.length - 1];
                this.editEventForm[model] = input.value;
            }
        });

        datepickers.forEach((input) => {
            if (input.classList.contains('ng-dirty')) {
                let model = input.getAttribute('ng-model').split('.');
                model = model[model.length - 1];
                this.editEventForm[model] = input.querySelector('.md-datepicker-input').value;
            }
        });

        if (this.editEventForm['tags']) {
            this.editEventForm.tags = this.eventForm.tags.split(',').map(str => str.trim());
        }

        if (this.editEventForm['creators']) {
            this.editEventForm.creators = this.eventForm.creators.split(',').map(str => str.trim());
        }

        if(this.editEventForm['dateFrom']) {
            this.editEventForm.dateFrom = new Date(this.eventForm.dateFrom).toLocaleString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'});
        }

        if(this.editEventForm['dateTo']) {
            this.editEventForm.dateTo = new Date(this.eventForm.dateTo).toLocaleString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'});
        }

        this.editEventForm['_id'] = this.eventForm._id;

        const event = this.editEventForm;

        mySocket.emit('editEvent', event);

        this.closeMenu();

    };

    // SEND COMMENT

    this.sendNewComment = (e, event, form) => {
        e.preventDefault();

        const date = new Date().toLocaleString('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        });

        let message = e.currentTarget.previousElementSibling.value;

        const comment = {
            userId: this.currentUser._id,
            id: event._id,
            date: date,
            author: this.currentUser.name,
            comment: message
        };

        mySocket.emit('sendNewComment', comment);

        e.currentTarget.previousElementSibling.value = null;
    };

    mySocket.on('retrieveEvent', (data) => {
        this.events.forEach((event, index) => {
            if (event._id === data.event._id) {
                this.events[index] = data.event;
            }
        });
    });

    // Rating interface

    this.rateEvent = (rating, eventId) => {

        const rate = {
            eventId: eventId,
            userId: this.currentUser._id,
            rating: rating,
            rated: true
        };

        mySocket.emit('rateEvent', rate);

        mySocket.on('retrieveRatedEvent', (data) => {
            this.ratedEvents.push(data.event);
        })
    };

}

app.component('eventsInterface', {
    controller: eventsInterfaceCtrl,
    templateUrl: './app/eventsInterface/eventsInterfaceView.html'
});
