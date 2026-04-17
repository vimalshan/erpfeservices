import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode, FieldNode, OperationDefinitionNode } from 'graphql';

@Injectable()
export abstract class BaseApolloService {
  constructor(protected readonly apollo: Apollo) {}

  protected evictFromCache(
    clientName: string,
    fieldName: string,
    args?: Record<string, any>,
    runGc = true,
  ): void {
    try {
      const client = clientName
        ? this.apollo.use(clientName).client
        : this.apollo.client;

      if (!client?.cache) {
        return;
      }

      const { cache } = client;
      const cacheData = cache.extract();
      const rootQueryKey = 'ROOT_QUERY';

      if (rootQueryKey in cacheData) {
        const rootQuery = cacheData[rootQueryKey];

        const fieldKey = args
          ? `${fieldName}(${JSON.stringify(args)})`
          : fieldName;

        if (rootQuery && (fieldName in rootQuery || fieldKey in rootQuery)) {
          cache.evict({
            fieldName,
            args,
          });

          if (runGc) {
            cache.gc();
          }
        }
      }
    } catch (error) {
      throw new Error(`Error during cache eviction: ${error}`);
    }
  }

  protected getQueryRootFieldName(queryDocument: DocumentNode): string | null {
    const operationDef = queryDocument.definitions.find(
      (def) => def.kind === 'OperationDefinition' && def.operation === 'query',
    ) as OperationDefinitionNode | undefined;

    if (!operationDef || !operationDef.selectionSet.selections.length) {
      return null;
    }
    const firstSelection = operationDef.selectionSet.selections[0];

    if (firstSelection.kind !== 'Field') {
      return null;
    }

    return (firstSelection as FieldNode).name.value;
  }
}
