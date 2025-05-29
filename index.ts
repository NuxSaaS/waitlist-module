import { addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  enabled: boolean
  path: string
  adminPath: string
  apiPath: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'waitlist',
    configKey: 'waitlist'
  },
  defaults: {
    enabled: true,
    path: '/waitlist',
    adminPath: '/admin/waitlist',
    apiPath: '/api/waitlist'
  },
  setup(options, nuxt) {
    if (!options.enabled) {
      return
    }

    const resolver = createResolver(import.meta.url)

    // Add server handlers
    addServerHandler({
      route: `${options.apiPath}/join`,
      handler: resolver.resolve('./server/api/waitlist/join.post.ts')
    })

    // Add route
    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'waitlist',
        path: options.path,
        file: resolver.resolve('./app/pages/waitlist/index.vue')
      })
    })

    // Add admin page route
    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'admin-waitlist',
        path: options.adminPath,
        file: resolver.resolve('./app/pages/admin-waitlist/index.vue')
      })
    })

    console.log('✅ Waitlist module enabled')
  }
})
