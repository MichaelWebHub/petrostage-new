angular.module('Online', ['btford.socket-io']);

angular.module('Online')
    .factory('mySocket', function (socketFactory) {
        const myIoSocket = io.connect('http://localhost:3000/');

        mySocket = socketFactory({
            ioSocket: myIoSocket
        });

        return mySocket;
    });