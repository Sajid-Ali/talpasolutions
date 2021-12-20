import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";

import { Sensor } from "../entities";
import {
  CreateSensorDataInput,
  CreateSensorInput,
  SensorDataInput,
} from "../dto";
import { SensorDataPoint } from "../entities/SensorDataPoint";

@Resolver()
export class SensorResolver {
  @Query(() => [Sensor])
  sensorList(@Ctx() { em }: MyContext): Promise<Sensor[]> {
    return em.find(Sensor, {});
  }

  @Query(() => Sensor, { nullable: true })
  getSensorById(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Sensor | null> {
    return em.findOne(Sensor, { id });
  }

  @Query(() => [Sensor], { nullable: true })
  getSensorByMachineId(
    @Arg("machine_id", () => Int) machine_id: number,
    @Ctx() { em }: MyContext
  ): Promise<Sensor[] | null> {
    return em.find(Sensor, { machine: machine_id });
  }

  @Mutation(() => Sensor, { nullable: true })
  async createSensor(
    @Arg("input", () => CreateSensorInput) input: CreateSensorInput,
    @Ctx() { em }: MyContext
  ): Promise<Sensor> {
    const sensor = em.create(Sensor, {
      name: input?.name,
      machine: input?.machine_id,
    });
    await em.persistAndFlush(sensor);
    return sensor;
  }

  @Mutation(() => Sensor, { nullable: true })
  async updateSensor(
    @Arg("id", () => Int) id: number,
    @Arg("name", () => String, { nullable: true }) name: string,
    @Ctx() { em }: MyContext
  ): Promise<Sensor | null> {
    const sensor = await em.findOne(Sensor, { id });
    if (!sensor) return null;
    if (name) sensor.name = name;
    await em.persistAndFlush(sensor);
    return sensor;
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteSensor(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean | null> {
    const sensor = await em.findOne(Sensor, { id });
    if (!sensor) return null;
    await em.nativeDelete(Sensor, { id });
    return true;
  }

  @Mutation(() => SensorDataPoint, { nullable: true })
  async createSensorDataPoint(
    @Arg("input", () => CreateSensorDataInput) input: CreateSensorDataInput,
    @Ctx() { em }: MyContext
  ): Promise<SensorDataPoint> {
    const sensorDataPoint = em.create(SensorDataPoint, {
      value: input?.value,
    });
    await em.persistAndFlush(sensorDataPoint);
    return sensorDataPoint;
  }

  @Query(() => [SensorDataPoint])
  sensorData(
    @Arg("input", () => SensorDataInput) input: SensorDataInput,
    @Ctx() { em }: MyContext
  ): Promise<SensorDataPoint[]> {
    return em.find(SensorDataPoint, {
      $or: [
        { id: input.id},
        {
          $and: [
            { createdAt: { $gte: input.from } },
            { createdAt: { $lte: input.to } },
          ]
        }
      ]
    });
  }
}
