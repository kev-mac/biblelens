import {integer,sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const syncDocuments=sqliteTable('sync_documents',{
 userId:text('user_id').primaryKey(),revision:integer('revision').notNull().default(0),data:text('data').notNull().default('{}'),updatedAt:integer('updated_at').notNull(),
});
export const syncPairCodes=sqliteTable('sync_pair_codes',{
 codeHash:text('code_hash').primaryKey(),userId:text('user_id').notNull(),expiresAt:integer('expires_at').notNull(),
});
export const syncDevices=sqliteTable('sync_devices',{
 tokenHash:text('token_hash').primaryKey(),userId:text('user_id').notNull(),expiresAt:integer('expires_at').notNull(),
});
