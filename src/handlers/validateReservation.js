const {
  execute,
  INSERT_RESERVATION,
  RESERVATIONS_QUERY,
} = require("../helpers/utilities");
const moment = require('moment');

const validateReservation = async (req, res) => {
  const { appointment, date, name, serviceId } = req.body.input.arg1;
  const userId = req.body.session_variables["x-hasura-user-id"];

  const currentDate = moment().format("YYYY-MM-DD");

  const { data, errors } = await execute(
    { currentDate, userId },
    RESERVATIONS_QUERY
  );

  // In case of errors:
  if (errors) {
    // TODO improve error messages
    console.log(errors);
    return res.status(400).json({
      message: "Something Happened, Try Again",
    });
  }

  // Validations
  
  data.reservations.forEach((r) => {
    console.log(r);
    if (r.date === date) {
      return res.status(400).json({
        message: "You already have a reservation for that day",
      });
    }
  });
  
  if (data.reservations.length >= 5) {
    res.status(400).json({
      message: "Limited to only 5 future reservations",
    });
  }else{

    console.log({ appointment, name, date, serviceId, userId });

    const insertReservations = await execute(
      { appointment, name, date, serviceId, userId },
      INSERT_RESERVATION
    );

    console.log(insertReservations.errors);
  
    if (!insertReservations.errors) {
      console.log(insertReservations.errors);
      return res.status(400).json({
        message: "Something happened",
      });
    } else {
      res.status(200).json({
        id: insertReservations.data.insert_reservations_one.id,
      });
    }
  }
  // Insert Validated Reservation

};

module.exports = validateReservation;
