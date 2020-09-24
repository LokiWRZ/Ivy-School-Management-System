if(process.env.NODE_ENV == "production"){
  module.exports = 
  {mongoURL:"mongodb+srv://peterwang:<1234>@cluster0.i3aip.mongodb.net/<dbname>?retryWrites=true&w=majority"}
}else{
  module.exports = 
  {mongoURL:"mongodb://localhost/node-app"}
}