const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const validateReservation = require('./src/handlers/validateReservation')
const getNextAvailableReservation = require('./src/handlers/getNextAvailableReservation')

const PORT = process.env.PORT || 3333;


app.use(bodyParser.json())

app.post("/validate-reservation", validateReservation);

app.post("/get-next-time", getNextAvailableReservation)

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
