import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, ID } from "type-graphql";
import { Machine } from "./Machine";

@ObjectType()
@Entity()
export class Sensor {
  @Field(() => ID)
  @PrimaryKey()
  id: number;

  @Field(() => String)
  @Property({ type: "text" })
  name: string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @OneToOne({ entity: () => Machine })
  machine!: Machine;
}
