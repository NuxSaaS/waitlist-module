<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
definePageMeta({
  auth: false
})

const { t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()
const route = useRoute()

const title = t('waitlist.title')
const description = t('waitlist.description')

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterTitle: title,
  twitterDescription: description
})

const schema = z.object({
  email: z.string().email(t('waitlist.errors.invalidEmail')),
  name: z.string().optional()
})

type Schema = zodOutput<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
  name: ''
})

const loading = ref(false)
const success = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (loading.value)
    return

  loading.value = true

  try {
    const response = await $fetch('/api/waitlist/join', {
      method: 'POST',
      body: {
        email: event.data.email,
        name: event.data.name || undefined,
        source: route.path
      }
    })

    if (response.success) {
      success.value = true
      toast.add({
        title: t('waitlist.success.title'),
        description: t('waitlist.success.message'),
        color: 'success'
      })
    }
  } catch (error: any) {
    let errorMessage = t('waitlist.errors.generalError')

    if (error.statusCode === 409) {
      errorMessage = t('waitlist.errors.alreadyRegistered')
    }

    toast.add({
      title: errorMessage,
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="relative py-24">
    <div class="max-w-2xl mx-auto">
      <div
        v-if="!success"
        class="text-center mb-12"
      >
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          {{ t('waitlist.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {{ t('waitlist.subtitle') }}
        </p>
        <p class="text-lg text-gray-500 dark:text-gray-500">
          {{ t('waitlist.description') }}
        </p>
      </div>

      <div
        v-if="success"
        class="text-center"
      >
        <div class="mb-8">
          <div class="mx-auto w-16 h-16 bg-success-100 dark:bg-success-900/50 rounded-full flex items-center justify-center mb-6">
            <UIcon
              name="i-lucide-check"
              class="w-8 h-8 text-success-500"
            />
          </div>
          <h1 class="text-4xl font-bold tracking-tight mb-4">
            {{ t('waitlist.success.title') }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {{ t('waitlist.success.message') }}
          </p>
          <UButton
            :to="localePath('/')"
            color="primary"
            size="lg"
          >
            {{ t('waitlist.success.backToHome') }}
          </UButton>
        </div>
      </div>

      <UCard
        v-if="!success"
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-xl"
      >
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
        >
          <UFormField
            :label="t('waitlist.form.email')"
            name="email"
            required
          >
            <UInput
              v-model="state.email"
              type="email"
              size="lg"
              :placeholder="t('waitlist.form.emailPlaceholder')"
              autocomplete="email"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('waitlist.form.name')"
            name="name"
          >
            <UInput
              v-model="state.name"
              type="text"
              size="lg"
              :placeholder="t('waitlist.form.namePlaceholder')"
              autocomplete="name"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            :loading="loading"
            :disabled="loading"
          >
            {{ loading ? t('waitlist.form.joining') : t('waitlist.form.joinWaitlist') }}
          </UButton>
        </UForm>
      </UCard>
    </div>
  </UContainer>
</template>
