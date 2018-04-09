function clientInterfaceCtrl($state, $transitions, AuthService, mySocket) {

    this.currentUserStatus = AuthService.isLoggedIn().status;
    this.currentUser = AuthService.isLoggedIn().user;

    this.logout = () => {
        AuthService.logOut();
    };
}

app.component('clientInterface', {
    controller: clientInterfaceCtrl,
    templateUrl: './app/clientInterface/clientInterfaceView.html'
});
