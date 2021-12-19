import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
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

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => Machine, { nullable: true })
  @ManyToOne(() => Machine)
  machine: Machine;
}
