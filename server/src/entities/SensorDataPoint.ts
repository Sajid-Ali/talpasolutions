import { Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, ID } from "type-graphql";
import { Sensor } from "./Sensor";

@ObjectType()
@Entity()
export class SensorDataPoint {
  @Field(() => ID)
  @PrimaryKey()
  id: number;

  @Field(() => Number)
  @Property({ type: "number" })
  value: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
