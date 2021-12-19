import { Field, InputType } from "type-graphql";

@InputType()
export class MachineInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  lastKnownPosition: string;
}

@InputType()
export class CreateInput extends MachineInput {}

@InputType()
export class UpdateInput extends MachineInput {}
