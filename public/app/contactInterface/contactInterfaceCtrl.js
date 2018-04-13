function contactInterfaceCtrl($state, $transitions, AuthService, mySocket) {

    this.contactMessage = "";
    this.currentUserStatus = AuthService.isLoggedIn().status;
    this.currentUser = AuthService.isLoggedIn().user;

    this.emailStatus = false;
    this.emailResponse = "";

    this.sendEmail = (e) => {
        e.preventDefault();

        let name, email;

        if (this.currentUserStatus) {
            name =  this.currentUser.name;
            email = this.currentUser.email;
        } else {
            name = "Guest";
            email = "Guest";
        }


        const messageBody = {
            from: {
                name: name,
                email: email
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
