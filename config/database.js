module.exports = {
    // heroku config
    //globalUri: "mongodb://heroku_619cjc94:8m1l6j9b2upcu0l8sgekcieg9i@ds231739.mlab.com:31739/heroku_619cjc94",
    globalUri: process.env.MONGODB_URI,
    localUri: "mongodb://localhost/petrostage"
};