export interface SortOptions {
  newest: {
    createdAt: 'desc'
  }
  oldest: {
    createdAt: 'asc'
  }
  'recently-updated': {
    updatedAt: 'desc'
  }
  'least-recently-updated': {
    updatedAt: 'asc'
  }
}
