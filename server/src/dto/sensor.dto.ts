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
