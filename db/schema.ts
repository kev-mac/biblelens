import {index,integer,sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const syncDocuments=sqliteTable('sync_documents',{
 userId:text('user_id').primaryKey(),revision:integer('revision').notNull().default(0),data:text('data').notNull().default('{}'),updatedAt:integer('updated_at').notNull(),
});
export const syncPairCodes=sqliteTable('sync_pair_codes',{
 codeHash:text('code_hash').primaryKey(),userId:text('user_id').notNull(),expiresAt:integer('expires_at').notNull(),
});
export const syncDevices=sqliteTable('sync_devices',{
 tokenHash:text('token_hash').primaryKey(),userId:text('user_id').notNull(),expiresAt:integer('expires_at').notNull(),
});
// No questions, notes or answers are stored. Only hashed trial identity,
// reservations and returned provider usage support persistent request limits.
export const aiSearchRequests=sqliteTable('ai_search_requests',{
 id:text('id').primaryKey(),userHash:text('user_hash').notNull(),createdAt:integer('created_at').notNull(),
 status:text('status').notNull().default('reserved'),inputTokens:integer('input_tokens').notNull().default(0),outputTokens:integer('output_tokens').notNull().default(0),webCalls:integer('web_calls').notNull().default(0),
},table=>[index('ai_search_created').on(table.createdAt),index('ai_search_user_created').on(table.userHash,table.createdAt)]);
export const aiTrialUsers=sqliteTable('ai_trial_users',{
 userHash:text('user_hash').primaryKey(),policy:text('policy').notNull(),
});
