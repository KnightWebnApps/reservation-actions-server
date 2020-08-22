const fetch = require("node-fetch");
const moment = require("moment");

const secret = "PopcornSpursSweetTooth";

const url = "https://knightapps-reservation-starter.herokuapp.com/v1/graphql";

const RESERVATIONS_QUERY =
  "query($currentDate: date, $userId: String){ reservations (where:{ date: {_gte: $currentDate} userId: {_eq: $userId} }){ id date } }";

const INSERT_RESERVATION = `
  mutation ($appointment: tstzrange, $name: String, $date: date, $serviceId: uuid, $userId: String){
    insert_reservations_one(object: {appointment: $appointment, date: $date, name: $name, serviceId: $serviceId, userId: $userId}) {
      id
      start_timestamp
      service {
        name
      }
    }
  }
  `;

const RESERVATION_BY_DAY = `
query($date: date){
  reservations (order_by: {appointment: asc} where: {
    date: {_eq: $date}
  }){
    id
		appointment
    end_timestamp
    start_timestamp
  }
}
`;

const GET_SERVICE = `
query($serviceId: uuid!){
  services_by_pk(id: $serviceId){
    id
    time
    price
  }
}
`;

const execute = async (variables, operation) => {
  const fetchResponse = await fetch(url, {
    method: "POST",
    headers: {
      "x-hasura-admin-secret": secret,
    },
    body: JSON.stringify({
      query: operation,
      variables,
    }),
  });
  return await fetchResponse.json();
};

module.exports = {
  execute,
  INSERT_RESERVATION,
  RESERVATIONS_QUERY,
  RESERVATION_BY_DAY,
  GET_SERVICE
};
