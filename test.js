const fs = require('fs')
const csv = require('csv-parser')
//onst randomWords = require('random-words')
const users = [];
// function generateUsername(firstname, surname) {
//     return `${firstname[0]}-${surname}`.toLowerCase();
// }
fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', function (row) {
    //const username = generateUsername(row.Firstname, row.Surname);
    
    
    const user = {
        name:row.NAME,
        password:row.PASSWORD
    }
    users.push(user)
  })
  .on('end', function () {
      console.log(users)
      // TODO: SAVE users data to another file
    })
