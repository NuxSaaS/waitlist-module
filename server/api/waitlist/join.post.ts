import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { waitlist } from '../../schema'

const joinWaitlistSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, joinWaitlistSchema.parse)

  const db = await useDB(event)
  const headers = getHeaders(event)

  // Check if email already exists
  const existingEntry = await db
    .select()
    .from(waitlist)
    .where(eq(waitlist.email, body.email))
    .limit(1)

  if (existingEntry.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Email already registered in waitlist'
    })
  }

  // Create new waitlist entry
  const newEntry = await db
    .insert(waitlist)
    .values({
      email: body.email,
      name: body.name,
      source: body.source,
      // ipAddress: getClientIP(event),
      userAgent: headers['user-agent'],
      referrer: headers.referer,
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
      utmCampaign: body.utmCampaign
    })
    .returning()

  return {
    success: true,
    message: 'Successfully joined waitlist',
    data: {
      id: newEntry[0]!.id,
      email: newEntry[0]!.email
    }
  }
})
