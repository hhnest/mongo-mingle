import { DynamicModule, Module } from "@nestjs/common";
import { MongoClient, MongoClientOptions } from "mongodb";
import { MongoMingle } from "./mongo-mingle";

@Module({})
export class MongoMingleModule {
  static forRoot(uri: string, options?: MongoClientOptions): DynamicModule {
    return {
      module: MongoMingleModule,
      providers: [
        { provide: MongoClient, useFactory: async () => new MongoClient(uri, options)},
        MongoMingle
      ],
      exports: [MongoMingle]
    };
  }
}