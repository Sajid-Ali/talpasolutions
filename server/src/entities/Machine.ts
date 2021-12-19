import {
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { ObjectType, Field, ID } from "type-graphql";
import { Sensor } from "./Sensor";

@ObjectType()
@Entity()
export class Machine {
  @Field(() => ID)
  @PrimaryKey()
  id: number;

  @Field(() => String)
  @Property({ type: "text" })
  name: string;

  @Field(() => String)
  @Property({ type: "text" })
  lastKnownPosition: string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => Sensor, sensor => [sensor])
  sensors: Sensor[];
}
