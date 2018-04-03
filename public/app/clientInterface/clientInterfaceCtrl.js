function clientInterfaceCtrl($state, $transitions, AuthService, mySocket) {

    const that = this;

    const getEvents = () => {
        mySocket.emit('getEvents');
        mySocket.on('retrieveEvents', (events) => {
            this.events = events.events;
        });
    };

    getEvents();


    this.currentUser = AuthService.isLoggedIn().user;

    this.eventPreloader = false;

    this.toggleMenu = (e) => {
        const eventForm = document.querySelector('.new-event-wrapper');
        eventForm.classList.toggle('enter');

    };

    this.validateDate = (er) => {
        console.log(er);
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

    this.addEvent = (e) => {
        e.preventDefault();
        this.eventPreloader = true;

        this.eventForm.tags = this.eventForm.tags.split(',');
        this.eventForm.tags = this.eventForm.tags.map(str => str.trim());
        const event = this.eventForm;

        mySocket.emit('addEvent', event);

        mySocket.on('retrieveEvent', (data) => {
            this.eventPreloader = false;
            this.events.push(data.event);

        })

    };

    this.logout = () => {
        AuthService.logOut();
    };
}

app.component('clientInterface', {
    controller: clientInterfaceCtrl,
    templateUrl: './app/clientInterface/clientInterfaceView.html'
});