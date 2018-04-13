function contactInterfaceCtrl($state, $transitions, AuthService, mySocket) {

    this.contactMessage = "";
    this.currentUserStatus = AuthService.isLoggedIn().status;
    this.currentUser = AuthService.isLoggedIn().user;

    this.emailStatus = false;
    this.emailResponse = "";

    this.sendEmail = (e) => {
        e.preventDefault();

        const messageBody = {
            from: {
                name: this.currentUser.name,
                email: this.currentUser.email
            },
            message: this.contactMessage
        };

        mySocket.emit('sendEmail', messageBody);
        mySocket.on('sendEmailCb', (data) => {
            this.emailStatus = data.status;
            this.emailResponse = data.text;
        });

    }

}

app.component('contactInterface', {
    controller: contactInterfaceCtrl,
    templateUrl: './app/contactInterface/contactInterfaceView.html'
});
