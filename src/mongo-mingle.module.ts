import { DynamicModule, Module } from "@nestjs/common";
import { MongoClient } from "mongodb";
import { MongoMingle } from "./mongo-mingle";

@Module({})
export class MongoMingleModule {
  static forRoot({uri}: {uri: string}): DynamicModule {
    return {
      module: MongoMingleModule,
      providers: [
        { provide: MongoClient, useFactory: async () => new MongoClient(uri),},
        MongoMingle
      ],
      exports: [MongoMingle]
    };
  }
}