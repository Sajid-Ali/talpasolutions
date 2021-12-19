import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";

import { Sensor } from "../entities";
import { CreateSensorInput } from "../dto";

@Resolver()
export class SensorResolver {
  @Query(() => [Sensor])
  SensorList(@Ctx() { em }: MyContext): Promise<Sensor[]> {
    return em.find(Sensor, {});
  }

  @Query(() => Sensor, { nullable: true })
  getSensorById(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Sensor | null> {
    return em.findOne(Sensor, { id });
  }

  @Mutation(() => Sensor, { nullable: true })
  async createSensor(
    @Arg("input", () => CreateSensorInput) input: CreateSensorInput,
    @Ctx() { em }: MyContext
  ): Promise<Sensor> {
    console.log("🚀 ~ file: sensor.resolver.ts ~ line 27 ~ SensorResolver ~ input", input)
    const sensor = em.create(Sensor, { name: input?.name, machine: input?.machine_id });
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
}
