import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(DbService.name);
  private pool: Pool;

  onModuleInit() {
    this.pool = new Pool({
      host:     process.env.DB_HOST     ?? 'localhost',
      port:     Number(process.env.DB_PORT ?? 5432),
      database: process.env.DB_NAME     ?? 'signalscope',
      user:     process.env.DB_USER     ?? 'signalscope',
      password: process.env.DB_PASS     ?? 'signalscope',
      max:      10,
    });

    this.pool.on('error', (err) => {
      this.log.error('Unexpected PostgreSQL pool error', err.message);
    });

    this.log.log(`Connected to ${process.env.DB_HOST ?? 'localhost'}/${process.env.DB_NAME ?? 'signalscope'}`);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    values?: unknown[],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(sql, values);
  }

  async connect(): Promise<PoolClient> {
    return this.pool.connect();
  }
}
