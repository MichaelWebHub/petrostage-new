angular.module('Online', ['btford.socket-io']);

angular.module('Online')
    .factory('mySocket', function (socketFactory) {
        const local = 'http://localhost:3000';
        const global = 'http://petrostage.org';

        const myIoSocket = io.connect(global);

        mySocket = socketFactory({
            ioSocket: myIoSocket
        });

        return mySocket;
    });