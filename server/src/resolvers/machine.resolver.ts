import { Machine } from "../entities";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { CreateInput } from "../dto";

@Resolver()
export class MachineResolver {
  @Query(() => [Machine])
  machineList(@Ctx() { em }: MyContext): Promise<Machine[]> {
    return em.find(Machine, {});
  }

  @Query(() => Machine, { nullable: true })
  getMachineById(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Machine | null> {
    return em.findOne(Machine, { id });
  }

  @Mutation(() => Machine, { nullable: true })
  async createMachine(
    @Arg("input", () => CreateInput) input: CreateInput,
    @Ctx() { em }: MyContext
  ): Promise<Machine> {
    const machine = em.create(Machine, { ...input });
    await em.persistAndFlush(machine);
    return machine;
  }

  @Mutation(() => Machine, { nullable: true })
  async updateMachine(
    @Arg("id", () => Int) id: number,
    @Arg("name", () => String, { nullable: true }) name: string,
    @Ctx() { em }: MyContext
  ): Promise<Machine | null> {
    const machine = await em.findOne(Machine, { id });
    if (!machine) return null;
    if (name) machine.name = name;
    await em.persistAndFlush(machine);
    return machine;
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteMachine(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean | null> {
    const machine = await em.findOne(Machine, { id });
    if (!machine) return null;
    await em.nativeDelete(Machine, { id });
    return true;
  }
}
