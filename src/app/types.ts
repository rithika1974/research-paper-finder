export interface Paper {
  title: string
  authors: string
  year: string
  source: string
  url: string
  abstract_summary: string
  relevance: string
  cite_sections: string[]
  field_tag: string
  impact: 'high' | 'medium'
}

export interface SearchParams {
  topic: string
  count: number
  source: string
  yearFrom?: number
}
