CREATE TABLE `ai_search_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`status` text DEFAULT 'reserved' NOT NULL,
	`input_tokens` integer DEFAULT 0 NOT NULL,
	`output_tokens` integer DEFAULT 0 NOT NULL,
	`web_calls` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `ai_search_created` ON `ai_search_requests` (`created_at`);--> statement-breakpoint
CREATE INDEX `ai_search_user_created` ON `ai_search_requests` (`user_hash`,`created_at`);