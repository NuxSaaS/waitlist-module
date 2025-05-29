<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
import AdminLayout from '~/layouts/admin.vue'

definePageMeta({
  layout: false
})

interface Waitlist {
  id: string
  email: string
  name?: string
  source?: string
  status: 'pending' | 'invited' | 'registered'
  ipAddress?: string
  userAgent?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  invitedAt?: Date
  registeredAt?: Date
  createdAt: Date
  updatedAt: Date
}

const { t } = useI18n()

const filters: AdminTableFilter[] = reactive([
  {
    name: t('waitlist.columns.email'),
    field: 'email',
    type: 'input',
    value: undefined
  },
  {
    name: t('global.page.status'),
    field: 'status',
    type: 'checkbox',
    items: [
      { label: t('waitlist.status.pending'), id: 'pending', count: 0 },
      { label: t('waitlist.status.invited'), id: 'invited', count: 0 },
      { label: t('waitlist.status.registered'), id: 'registered', count: 0 }
    ],
    value: []
  },
  {
    name: t('global.page.createdAt'),
    field: 'createdAt',
    type: 'daterange',
    value: { start: undefined, end: undefined }
  }
])

const columns: AdminTableColumn<Waitlist>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'email',
    header: t('waitlist.columns.email')
  },
  {
    accessorKey: 'name',
    header: t('waitlist.columns.name')
  },
  {
    accessorKey: 'status',
    header: t('global.page.status')
  },
  {
    accessorKey: 'source',
    header: t('waitlist.columns.source')
  },
  {
    accessorKey: 'createdAt',
    header: t('global.page.createdAt'),
    cell: dateColumn
  }
]

const getStatusColor = (status: string): 'success' | 'warning' | 'neutral' => {
  switch (status) {
    case 'registered':
      return 'success'
    case 'pending':
      return 'neutral'
    case 'invited':
      return 'warning'
    default:
      return 'neutral'
  }
}

const fetchStatusCount = async (filter: FilterCondition[]) => {
  const statusCount = await $fetch<ColumnCount[]>('/api/admin/count/waitlist/status', {
    query: {
      filter: JSON.stringify(filter)
    }
  })
  const statusFilter = filters[1] as FilterTabs
  statusFilter.items.forEach((item) => {
    const status = statusCount.find(status => status.column === item.id)
    item.count = status ? status.count : 0
  })
}

const fetchData: FetchDataFn<Waitlist> = async ({ page, limit, sort, filter }) => {
  fetchStatusCount(filter)
  const result = await $fetch<PageData<Waitlist>>('/api/admin/list/waitlist', {
    query: {
      page,
      limit,
      sort: JSON.stringify(sort.map((item) => {
        return [item.field, item.order]
      })),
      filter: JSON.stringify(filter)
    }
  })
  return {
    data: result.data,
    total: result.total
  }
}
</script>

<template>
  <AdminLayout>
    <AdminTable
      :filters="filters"
      :columns="columns"
      :fetch-data="fetchData"
    >
      <template #status-cell="{ row: { original } }">
        <UBadge
          :color="getStatusColor(original.status)"
          :label="t(`waitlist.status.${original.status}`)"
        />
      </template>
    </AdminTable>
  </AdminLayout>
</template>
