angular.module('Online', ['btford.socket-io']);

angular.module('Online')
    .factory('mySocket', function (socketFactory) {
        const myIoSocket = io.connect('https://salty-stream-57884.herokuapp.com/');

        mySocket = socketFactory({
            ioSocket: myIoSocket
        });

        return mySocket;
    });