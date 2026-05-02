import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Read-only Supabase client for Server Components.
 *
 * setAll is intentionally a no-op here. In Next.js 14 streaming mode,
 * calling cookies().set() from next/headers schedules its cookie mutation
 * asynchronously. After streaming flushes the response headers, Next.js
 * processes those pending mutations via response.appendHeader('Set-Cookie')
 * which fails with ERR_HTTP_HEADERS_SENT — even with try/catch around the
 * set() call — because the error is thrown outside our catch boundary.
 *
 * Session tokens are refreshed exclusively by middleware.ts (which runs
 * before any RSC render and can safely write Set-Cookie headers while the
 * response is still open).
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // No-op: session refresh is handled by middleware.ts
        },
      },
    },
  )
}

/**
 * Full read-write client for Route Handlers and Server Actions.
 * Unlike createClient(), this one does set cookies so that session
 * refreshes are persisted during non-GET API calls.
 */
export async function createRouteHandlerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          // Route Handlers / Server Actions are allowed to set cookies.
          // Wrap defensively in case an edge case still triggers the issue.
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Silently drop — request already committed
          }
        },
      },
    },
  )
}

/**
 * Service-role client for webhook/admin operations.
 * NEVER expose this to the browser.
 */
export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    },
  )
}
