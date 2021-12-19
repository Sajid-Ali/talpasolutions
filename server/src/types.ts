import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};

export type SensorDataPoint = {
  timestamp: Date;
  value: number;
};

export type GPSPosition = {
  lat: number;
  lang: number;
};

// Query {
//   machine(where: MachineWhereUniqInput!): Machine
//   machines: [Machine!]
//   sensorData(id: ID!, from: DateTime!, to: DateTime!): [SensorDataPoint]
// }
// export type Machine = {
//   name: String
//   sensors: [Sensor]
//   lastKnownPosition: GPSPosition
// }
// export type Sensor = {
//   name: String
//   machine: Machine
// }
