function authUserCtrl(AuthService) {

    const that = this;

    this.preloader = false;
    this.status = true;

    this.switchForm = function() {
        this.loginForm = !this.loginForm;
        this.message = "";
    };

    this.loginAndSwitch = (e) => {
        e.preventDefault();

        this.preloader = true;

        const body = {
            email: this.loginUser.email.toLowerCase(),
            password: this.loginUser.password.toLowerCase()
        };

        AuthService.login(body, (user) => {
            this.status = user.status;
            this.message = user.message;
            this.preloader = user.status;
        });
    };

    this.signupAndSwitch = (e) => {
        e.preventDefault();

        this.preloader = true;

        const body = {
            email: this.signupUser.email.toLowerCase(),
            password: this.signupUser.password.toLowerCase(),
            name: this.signupUser.name,
            university: this.signupUser.university
        };

        //https://serene-thicket-37274.herokuapp.com/login
        AuthService.signup(body, (user) => {
            this.status = user.status;
            this.message = user.message;
            this.preloader = user.status;
        });
    };
}

app.component('authUser', {
    controller: authUserCtrl,
    templateUrl: './app/authUser/authUserView.html'
});
