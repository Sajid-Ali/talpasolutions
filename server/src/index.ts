import "reflect-metadata";
import express from "express";
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import { MachineResolver, SensorResolver } from "./resolvers";

const main = async () => {
  const ORM = await MikroORM.init(mikroOrmConfig);
  await ORM.getMigrator().up();
  const PORT = process.env.PORT || 4001;

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [MachineResolver, SensorResolver],
      validate: false,
    }),
    context: () => ({ em: ORM.em }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(
      `Server is running on http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
};

main().catch((error) => {
  console.error(error);
});

