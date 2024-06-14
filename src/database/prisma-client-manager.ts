import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', `${schema}_ms_commercial`); // TODO: deve ser posto o nome do modulo no final para não sobrescrever o schema.
  return url.toString();
}

@Injectable()
export class PrismaClientManager implements OnModuleDestroy {
  // the client instances cache object
  private clients: { [key: string]: PrismaClient } = {};

  getTenantId(request: Request): string {
    // TODO: retrieve and return the tenant ID from the request object,
    // eventually throw an exception if the ID is not valid

    return request.params.tenantId;
  }

  getClient(request: Request): PrismaClient {
    const tenantId = this.getTenantId(request);
    let client = this.clients[tenantId];

    // create and cache a new client when needed
    if (!client) {
      const databaseUrl = generateDatabaseURL(tenantId);

      process.env.DATABASE_URL = databaseUrl;

      execSync('npx prisma migrate deploy');

      client = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      });

      // setup prisma middlewares if any

      this.clients[tenantId] = client;
    }

    return client;
  }

  async onModuleDestroy() {
    // wait for every cached instance to be disposed
    await Promise.all(
      Object.values(this.clients).map((client) => client.$disconnect()),
    );
  }
}
