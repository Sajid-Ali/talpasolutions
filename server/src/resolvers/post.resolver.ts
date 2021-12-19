import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";

import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  list(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  getById(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post, { nullable: true })
  async create(
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async update(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) return null;
    if (title) post.title = title;
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean, { nullable: true })
  async delete(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean | null> {
    const post = await em.findOne(Post, { id });
    console.log("🚀 ~ file: post.ts ~ line 50 ~ PostResolver ~ post", post)
    if (!post) return null;
    await em.nativeDelete(Post, { id });
    return true;
  }
}
