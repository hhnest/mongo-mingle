import { Injectable, Logger } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, finalize, map, mergeMap, switchMap } from 'rxjs/operators';
import { CollectionOperations, OperationStep } from './collection-operations';


@Injectable()
export class MongoMingle {
  constructor(
    private readonly mongoClient: MongoClient,
  ) {
  }

  /**
   * Execute operations in sequence, only if the operation has not been executed yet
   * @param operations 
   * @returns 
   */
  executeOperations(operations: {collectionName: string, operationStep: OperationStep, operation$: Observable<void>}[]): Observable<void> {
    return from(this.mongoClient.connect()).pipe(
      map((mongoClient: MongoClient) => mongoClient.db().collection<CollectionOperations>('mongo-mingle-operations')),
      switchMap((collection: Collection<any>) => from(operations.map((op) => this.#executeOperationStep(collection, op)))),
      concatMap((o: Observable<void>) => o),
      finalize(() => Logger.log('All operations executed', 'MongoMingle')),
    )
  }

  #executeOperationStep(collection: Collection<CollectionOperations>, {collectionName, operationStep, operation$}: {collectionName: string, operationStep: OperationStep, operation$: Observable<void>}): Observable<void> {
    return of(void 0).pipe(
      switchMap(() => from(collection.findOne({ collection: collectionName, 'steps.name': operationStep.name, error: { $exists: false } }))),
      switchMap(existingOperation => {
        if (existingOperation) {
          Logger.debug(`Operation "${operationStep.name}" to collection "${collectionName}" has already been executed.`, 'MongoMingle');
          return of(void 0);
        } else {
          Logger.log(`Executing operation "${operationStep.name}" to collection "${collectionName}"`, 'MongoMingle');
          return operation$.pipe(
            switchMap(() => {
              return from(collection.updateOne(
                { collection: collectionName },
                { $push: { steps: { ...operationStep, appliedAt: new Date() } } },
                { upsert: true }
              )).pipe(
                map(() => void 0)
              );
            }),
            catchError((err: any) => {
              Logger.error(`Error executing operation "${operationStep.name}" to collection "${collectionName}"`, err, 'MongoMingle');
              return from(collection.updateOne(
                { collection: collectionName },
                { $push: { steps: { ...operationStep, appliedAt: new Date(), error: err.message } } },
                { upsert: true }
              )).pipe(
                mergeMap(() => throwError(() => err))
              );
            })
          );
        }
      })
    );
  }

}
