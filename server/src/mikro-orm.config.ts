import path from "path";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Machine, Sensor } from "./entities";
import { SensorDataPoint } from "./entities/SensorDataPoint";

export default {
  entities: [Sensor, Machine, SensorDataPoint ],
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  dbName: "talpasolutions",
  type: "postgresql",
  user: "postgres",
  password: "P@ssword13",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
