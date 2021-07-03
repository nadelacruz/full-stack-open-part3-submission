const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("Please provide the password as an argument: node mongo.js <password>");
    process.exit(1);
} else if (process.argv.length === 4) {
    console.log("Please provide the new person's name and number as an argument: node mongo.js <password> <name> <number>");
    process.exit(1);
} else if (process.argv.length > 5) {
    console.log("Too many arguments supplied. Please try again.");
    process.exit(1);
}

const password = process.argv[2];
const newName = process.argv[3] || "";
const newNumber = process.argv[4] || "";

const url = 
`mongodb+srv://fullstack:${password}@cluster0.9vlnr.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const PersonSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", PersonSchema);

if (newName !== "" && newNumber !== "") {
    const person = new Person({
        name: newName,
        number: newNumber
    });

    person.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook`);
        mongoose.connection.close();
    });
} else {
    Person.find({}).then(result => {
        console.log("phonebook:");
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
}