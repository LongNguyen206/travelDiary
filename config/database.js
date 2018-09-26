// if production, use Mlab else use local db
// if (process.env.NODE_ENV === "production"){
//     module.exports = { mongoURI: 'mongodb://Long:ABC123456@ds143330.mlab.com:43330/travel-diary'}
// } else {
    module.exports = { mongoURI: 'mongodb://localhost/travel-diary' }
// }