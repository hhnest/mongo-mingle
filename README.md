# GRANTED Module for Nestjs

[![npm](https://img.shields.io/npm/v/%40hhnest%2Fmongo-mingle?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@hhnest/mongo-mingle)
[![npm](https://img.shields.io/npm/v/%40hhnest%2Fmongo-mingle?style=for-the-badge&logo=github&label=github)](https://github.com/hhnest/mongo-mingle)

[![Build hhnest/mongo-mingle](https://github.com/hhnest/mongo-mingle/actions/workflows/main.yml/badge.svg)](https://github.com/hhnest/mongo-mingle/actions/workflows/main.yml)
[![Publish hhnest/mongo-mingle to NPM](https://github.com/hhnest/mongo-mingle/actions/workflows/tag.yml/badge.svg)](https://github.com/hhnest/mongo-mingle/actions/workflows/tag.yml)



This module allow you to use MongoDB Mingle on your nestjs project

## Install @hhnest/mongo-mingle

You can use either the npm or yarn command-line tool to install the `package`.    
Use whichever is appropriate for your project in the examples below.

### NPM

```bash
# @hhnest/mongo-mingle
npm install @hhnest/mongo-mingle --save 
```

### YARN

```bash
# @hhnest/mongo-mingle
yarn add @hhnest/mongo-mingle
```

### Peer dependencies

| name | version |
|---|---|
| @nestjs/common | ^10.0.0 |
| @nestjs/core | ^10.0.0 |

### Dependencies
| name | version |
|---|---|
| mongodb | ^6.10.0 |

## Configuration

Just import the module `MongoMingleModule`, specify the url of database for save steps


Header provider
`AppModule.ts`
```typescript
@Module({
  // Declare the module and define the option apply (for apply or not the security)
  imports: [
    MongoMingleModule.forRoot({url: 'mongodb://localhost:27017/database'}),
  ],
})
export class AppModule {}
```

## Use

```typescript

@Injectable()
export class MyService {
  constructor(
    @Log(MyService.name) private readonly logger: Logger,
    private readonly mongoMingle: MongoMingle,
  ) {
  }

  init(): Observable<void> {
    return this.mongoMingle.executeOperations([
      {collectionName: 'collectionTarget', operationStep: {name: 'init-default-values', operationType: OperationType.INIT, description: 'Add default values'}, operation$: this.#addDefaultValues()},
      {collectionName: 'collectionTarget', operationStep: {name: 'add-field', operationType: OperationType.STRUCT, description: 'Add field'}, operation$: this.#addField()},
      {collectionName: 'collectionTarget', operationStep: {name: 'rename-field', operationType: OperationType.MIGRATE, description: 'Rename field'}, operation$: this.#renameField()},
    ]);
  }
}
```

