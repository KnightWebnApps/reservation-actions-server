const { execute, RESERVATION_BY_DAY, GET_SERVICE } = require("../helpers/utilities");
const moment = require("moment");


const getNextAvailableReservation = async (res, req) => {
  const { date, serviceId } = req.body.input.arg1;

  const { data: reservations, errors } = await execute({ date }, RESERVATION_BY_DAY);

  const { data: services_by_pk } = await execute({ serviceId }, GET_SERVICE);

  if(errors){
    console.log(errors)
    res.status(400).json({
      message: "Failed to get Reservations"
    })
  }

  if(reservations.length === 0){
    res.status(200).json({
      nextAvailableReservation: `${date} at 8:00 AM is available`
    })
  }

  reservations.forEach(( res, i ) => {

    const end = moment(res.end_timestamp);
    const next =
      i === reservations.length
        ? null
        : moment(reservations[i + 1].start_timestamp);
    console.log(end, next)

    if(next === null){
      if(end.add(services_by_pk.time, 'm').isBefore(moment(`${date} 17:00:00`))){
        res.status(200).json({
          nextAvailableReservation: `${date} at ${moment(res.end_timestamp).format('h:mm a')} is available`
        })
      }else{
        res.status(200).json({
          nextAvailableReservation: `No available appointments for ${date}`
        })
      }
    }

    if(next !== null && end.add(services_by_pk.time, 'm').isBefore(next)){
      res.status(200).json({
        nextAvailableReservation: `${date} at ${end.format('h:mm a')} is available`
      })
    }

  })

}

module.exports = getNextAvailableReservation;