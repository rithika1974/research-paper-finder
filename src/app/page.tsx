'use client'

import { useState, useRef, useCallback } from 'react'
import type { Paper, SearchParams } from './types'

const EXAMPLE_PROMPTS = [
  "I'm studying how gut microbiome diversity affects mental health in adolescents, specifically the gut-brain axis and depression biomarkers.",
  "Researching transformer architectures for low-resource language translation, focusing on zero-shot cross-lingual transfer.",
  "Investigating the effect of urban heat islands on cardiovascular mortality in elderly populations across Asian megacities.",
  "Studying CRISPR-Cas9 off-target effects in somatic gene therapy for sickle cell disease.",
]

const SOURCE_OPTIONS = [
  { value: 'all', label: 'All sources', icon: '🌐' },
  { value: 'scholar', label: 'Google Scholar', icon: '🎓' },
  { value: 'arxiv', label: 'arXiv / Preprints', icon: '📄' },
  { value: 'pubmed', label: 'PubMed / Biomedical', icon: '🧬' },
]

const YEAR_OPTIONS = [
  { value: '', label: 'Any year' },
  { value: '2020', label: '2020 and later' },
  { value: '2018', label: '2018 and later' },
  { value: '2015', label: '2015 and later' },
  { value: '2010', label: '2010 and later' },
]

const COUNT_OPTIONS = [4, 6, 8, 10]

const CITE_COLORS: Record<string, string> = {
  'Introduction': 'bg-blue-100 text-blue-800',
  'Literature Review': 'bg-purple-100 text-purple-800',
  'Related Work': 'bg-purple-100 text-purple-800',
  'Background': 'bg-indigo-100 text-indigo-800',
  'Methods': 'bg-green-100 text-green-800',
  'Methodology': 'bg-green-100 text-green-800',
  'Results': 'bg-yellow-100 text-yellow-800',
  'Discussion': 'bg-orange-100 text-orange-800',
  'Conclusion': 'bg-red-100 text-red-800',
}

function getCiteColor(section: string) {
  for (const [key, cls] of Object.entries(CITE_COLORS)) {
    if (section.toLowerCase().includes(key.toLowerCase())) return cls
  }
  return 'bg-gray-100 text-gray-700'
}

function PaperCard({ paper, index }: { paper: Paper; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const fadeClass = `animate-fade-up-${Math.min(index + 1, 6)}`

  return (
    <article
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${fadeClass}`}
      aria-label={`Paper: ${paper.title}`}
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              paper.impact === 'high' ? 'bg-brand-100 text-brand-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {paper.impact === 'high' ? '⭐ High impact' : 'Relevant'}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              {paper.field_tag}
            </span>
          </div>
          {paper.url && (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
              aria-label={`Open paper: ${paper.title}`}
            >
              View ↗
            </a>
          )}
        </div>

        <h2 className="text-base font-semibold text-gray-900 leading-snug mb-1">
          {paper.title}
        </h2>
        <p className="text-sm text-gray-500">
          {paper.authors} · <span className="font-medium text-gray-600">{paper.source}</span>
        </p>
      </div>

      {/* Body */}
      <div className="px-5 pb-4 space-y-3">
        {/* Summary */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Summary</p>
          <p className="text-sm text-gray-700 leading-relaxed">{paper.abstract_summary}</p>
        </div>

        {/* Relevance - always visible */}
        <div className="bg-brand-50 rounded-xl p-3 border border-brand-100">
          <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">
            💡 How it helps your research
          </p>
          <p className="text-sm text-brand-900 leading-relaxed">{paper.relevance}</p>
        </div>

        {/* Cite sections */}
        {paper.cite_sections?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              📌 Where to cite
            </p>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Sections where this paper can be cited">
              {paper.cite_sections.map((s) => (
                <span
                  key={s}
                  role="listitem"
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getCiteColor(s)}`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Copy citation button */}
      <div className="px-5 pb-4">
        <button
          onClick={() => {
            const citation = `${paper.authors}. "${paper.title}". ${paper.source} (${paper.year}). ${paper.url}`
            navigator.clipboard.writeText(citation)
          }}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
          aria-label="Copy citation to clipboard"
        >
          📋 Copy citation
        </button>
      </div>
    </article>
  )
}

function LoadingCard({ index }: { index: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse"
      aria-hidden="true"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
      </div>
      <div className="mt-3 bg-green-50 rounded-xl p-3 space-y-2">
        <div className="h-3 bg-green-100 rounded w-1/3" />
        <div className="h-3 bg-green-100 rounded w-4/5" />
        <div className="h-3 bg-green-100 rounded w-2/3" />
      </div>
    </div>
  )
}

export default function Home() {
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(6)
  const [source, setSource] = useState('all')
  const [yearFrom, setYearFrom] = useState('')
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSearch = useCallback(async () => {
    if (!topic.trim() || loading) return
    if (topic.trim().length < 10) {
      setError('Please describe your research in more detail (at least a sentence).')
      return
    }

    setLoading(true)
    setError('')
    setPapers([])
    setHasSearched(true)
    setStatusMsg('Finding relevant papers…')

    setTimeout(() => {
      if (loading) setStatusMsg('Gemini is reading and summarizing papers…')
    }, 3000)

    try {
      const params: SearchParams = {
        topic: topic.trim(),
        count,
        source,
        yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      }

      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Search failed')
      }

      setPapers(data.papers)
      setStatusMsg('')

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      setStatusMsg('')
    } finally {
      setLoading(false)
    }
  }, [topic, count, source, yearFrom, loading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleExampleClick = (example: string) => {
    setTopic(example)
    textareaRef.current?.focus()
  }

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(papers, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'research-papers.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportBib = () => {
    const bib = papers.map((p, i) => {
      const key = `paper${i + 1}`
      const authorParts = p.authors.split(',')[0].replace(' et al.', '').trim()
      return `@article{${key},\n  title={${p.title}},\n  author={${authorParts} and others},\n  journal={${p.source}},\n  year={${p.year}},\n  url={${p.url}}\n}`
    }).join('\n\n')
    const blob = new Blob([bib], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'references.bib'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to content */}
      <a href="#results" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-600 text-white px-4 py-2 rounded-lg z-50">
        Skip to results
      </a>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">🔬</span>
            <span className="font-semibold text-gray-900">Research Finder</span>
            <span className="hidden sm:inline text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
              powered by Gemini
            </span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
            aria-label="View source on GitHub"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" /></svg>
            GitHub
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-3 leading-tight">
            Find papers that matter<br className="hidden sm:block" /> for <span className="text-brand-600">your</span> research
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Describe your research and get AI-curated papers with summaries, relevance analysis, and citation suggestions — in seconds.
          </p>
        </div>

        {/* Search Form */}
        <section aria-label="Search form" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">

          {/* Textarea */}
          <div className="mb-4">
            <label htmlFor="research-topic" className="block text-sm font-medium text-gray-700 mb-1.5">
              Describe your research <span className="text-gray-400 font-normal">(the more detail, the better)</span>
            </label>
            <textarea
              id="research-topic"
              ref={textareaRef}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. I am studying the role of neuroinflammation in early-onset Alzheimer's disease, specifically how microglial activation affects amyloid-beta clearance..."
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none resize-none transition-colors"
              aria-describedby="topic-hint"
              disabled={loading}
            />
            <p id="topic-hint" className="mt-1 text-xs text-gray-400">
              Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-xs">Ctrl+Enter</kbd> to search
            </p>
          </div>

          {/* Options row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <label htmlFor="source-select" className="block text-xs font-medium text-gray-500 mb-1">Source</label>
              <select
                id="source-select"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none bg-white"
              >
                {SOURCE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.icon} {o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year-select" className="block text-xs font-medium text-gray-500 mb-1">Year</label>
              <select
                id="year-select"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none bg-white"
              >
                {YEAR_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="count-select" className="block text-xs font-medium text-gray-500 mb-1">Papers</label>
              <select
                id="count-select"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none bg-white"
              >
                {COUNT_OPTIONS.map(n => (
                  <option key={n} value={n}>{n} papers</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading || !topic.trim()}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Searching…
                  </span>
                ) : '🔍 Find Papers'}
              </button>
            </div>
          </div>

          {/* Example prompts */}
          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium">Try an example:</p>
            <div className="flex flex-wrap gap-2" role="list">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  role="listitem"
                  onClick={() => handleExampleClick(ex)}
                  disabled={loading}
                  className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  aria-label={`Use example: ${ex.substring(0, 50)}...`}
                >
                  {ex.length > 55 ? ex.substring(0, 52) + '…' : ex}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start gap-2"
          >
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Status */}
        {loading && statusMsg && (
          <div role="status" aria-live="polite" className="mb-6 flex items-center gap-3 text-sm text-gray-500 bg-white rounded-xl border border-gray-200 px-4 py-3">
            <svg className="animate-spin h-4 w-4 text-brand-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            {statusMsg}
          </div>
        )}

        {/* Results */}
        <div id="results" ref={resultsRef}>
          {/* Loading skeleton */}
          {loading && (
            <div
              className="grid gap-4 sm:grid-cols-2"
              aria-label="Loading papers"
              aria-busy="true"
            >
              {Array.from({ length: count }).map((_, i) => (
                <LoadingCard key={i} index={i} />
              ))}
            </div>
          )}

          {/* Results header + export */}
          {!loading && papers.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-800">
                  {papers.length} papers found
                </h2>
                <div className="flex gap-2" role="group" aria-label="Export options">
                  <button
                    onClick={handleExportBib}
                    className="text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    aria-label="Export as BibTeX file"
                  >
                    Export .bib
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    aria-label="Export as JSON file"
                  >
                    Export JSON
                  </button>
                </div>
              </div>

              <section
                aria-label={`Search results: ${papers.length} papers`}
                className="grid gap-4 sm:grid-cols-2"
              >
                {papers.map((paper, i) => (
                  <PaperCard key={i} paper={paper} index={i} />
                ))}
              </section>
            </>
          )}

          {/* Empty state */}
          {!loading && !hasSearched && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4" aria-hidden="true">📚</div>
              <p className="text-base font-medium text-gray-500">Your papers will appear here</p>
              <p className="text-sm mt-1">Describe your research above and hit Find Papers</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-400 border-t border-gray-100 mt-12">
        <p>Research Finder · Built with Next.js + Gemini 2.0 Flash · Free to use</p>
        <p className="mt-1">Always verify paper details before citing. AI may occasionally hallucinate titles or URLs.</p>
      </footer>
    </div>
  )
}
