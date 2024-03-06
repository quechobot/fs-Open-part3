const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('few arguments: missing password')
  process.exit(1)
}
const password = process.argv[2]
const url =`mongodb+srv://alum2c:${password}@clusterquecho.pxyrjsn.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=ClusterQuecho`
mongoose.set('strictQuery',false)
mongoose.connect(url)
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)
if (process.argv.length===3){
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else if(process.argv.length===5){
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(result => {
    console.log(result)
    mongoose.connection.close()
  })
}else{
  console.log('invalid arguments')
  process.exit(1)
}