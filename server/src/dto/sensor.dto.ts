import { Field, InputType } from "type-graphql";

@InputType()
export class SensorInput {
  @Field(() => String)
  name: string;
}

@InputType()
export class CreateSensorInput extends SensorInput {
  @Field(() => Number)
  machine_id: number;
}

@InputType()
export class CreateSensorDataInput {
  @Field(() => Number)
  value: number;
}

@InputType()
export class SensorDataInput {
  @Field(() => Number)
  id: number;

  @Field(() => String, { nullable: true })
  from: Date;

  @Field(() => String, { nullable: true })
  to: Date;
}
