/* eslint-disable @typescript-eslint/no-empty-function */
import { getRepositoryToken } from '@nestjs/typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'

export function createMockRepositoryProvider(entityClass: EntityClassOrSchema) {
  const providerValue = {
    createQueryBuilder: () => {
      return {
        getOne() {},
        addSelect() {
          return this
        },
        where() {
          return this
        },
      }
    },
    findOne() {},
    save() {},
    find() {},
  }
  return {
    provide: getRepositoryToken(entityClass),
    useValue: providerValue,
  }
}
