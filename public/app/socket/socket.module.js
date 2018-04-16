angular.module('Online', ['btford.socket-io']);

angular.module('Online')
    .factory('mySocket', function (socketFactory) {
        const local = 'http://localhost:3000';
        const global = 'https://salty-stream-57884.herokuapp.com/';

        const myIoSocket = io.connect(local);

        mySocket = socketFactory({
            ioSocket: myIoSocket
        });

        return mySocket;
    });