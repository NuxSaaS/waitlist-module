import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const waitlist = pgTable('waitlist', {
  id: uuid('id').primaryKey().$default(() => uuidv7()),

  // User's email address, required and unique to prevent duplicates
  email: text('email').notNull().unique(),

  // Optional user name for personalization
  name: text('name'),

  // Source channel where user joined the waitlist (e.g., homepage, pricing)
  source: text('source'),

  // Current status of the waitlist entry (pending, invited, registered)
  status: text('status').notNull().default('pending'),

  // User's IP address for geolocation analysis and security monitoring
  ipAddress: text('ip_address'),

  // Browser user agent string for device and browser analytics
  userAgent: text('user_agent'),

  // Referring page URL for traffic source analysis
  referrer: text('referrer'),

  // UTM source parameter for marketing campaign tracking
  utmSource: text('utm_source'),

  // UTM medium parameter for marketing channel identification
  utmMedium: text('utm_medium'),

  // UTM campaign parameter for specific marketing campaign tracking
  utmCampaign: text('utm_campaign'),

  // Timestamp when invitation was sent to the user
  invitedAt: timestamp('invited_at'),

  // Timestamp when user completed registration
  registeredAt: timestamp('registered_at'),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at').notNull().defaultNow()
})
