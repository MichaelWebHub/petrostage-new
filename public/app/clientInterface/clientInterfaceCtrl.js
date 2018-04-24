function clientInterfaceCtrl($state, $transitions, AuthService, mySocket) {

    this.currentUserStatus = AuthService.isLoggedIn().status;
    this.currentUser = AuthService.isLoggedIn().user;

    this.logout = () => {
        AuthService.logOut();
        $state.go('auth');
    };

    this.login = () => {
        $state.go('auth');
    };
}

app.component('clientInterface', {
    controller: clientInterfaceCtrl,
    templateUrl: './app/clientInterface/clientInterfaceView.html'
});
