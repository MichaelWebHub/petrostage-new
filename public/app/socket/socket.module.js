angular.module('Online', ['btford.socket-io']);

angular.module('Online')
    // https://salty-stream-57884.herokuapp.com/
    .factory('mySocket', function (socketFactory) {
        const myIoSocket = io.connect('https://salty-stream-57884.herokuapp.com/');

        mySocket = socketFactory({
            ioSocket: myIoSocket
        });

        return mySocket;
    });