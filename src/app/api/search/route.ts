import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const maxDuration = 60

interface SearchRequest {
  topic: string
  count: number
  source: string
  yearFrom?: number
}

export async function POST(req: NextRequest) {
  try {
    const body: SearchRequest = await req.json()
    const { topic, count = 6, source = 'all', yearFrom } = body

    if (!topic || topic.trim().length < 10) {
      return NextResponse.json({ error: 'Please provide a more detailed research description (at least 10 characters).' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured. Please set GEMINI_API_KEY in your environment.' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const sourceHint =
      source === 'arxiv' ? 'Prioritize arXiv preprints, NeurIPS, ICML, ICLR, and recent conference papers.' :
      source === 'pubmed' ? 'Prioritize PubMed, biomedical journals, The Lancet, Nature Medicine, NEJM, and clinical studies.' :
      source === 'scholar' ? 'Search broadly across Google Scholar — include highly-cited papers.' :
      'Search across Google Scholar, arXiv, PubMed, Semantic Scholar, IEEE, ACM, Nature, and Science.'

    const yearHint = yearFrom ? `Only include papers published in ${yearFrom} or later.` : ''

    const prompt = `You are an expert research librarian. A researcher has described their work below. Find ${count} real, highly relevant academic papers.

RESEARCH DESCRIPTION:
"""
${topic.trim()}
"""

INSTRUCTIONS:
- ${sourceHint}
- ${yearHint}
- Papers must be real and verifiable — use actual titles, authors, and years you are confident about.
- For each paper, deeply analyze how it connects to the researcher's specific goals.
- Be precise about WHERE in a research paper this could be cited.

Return ONLY a valid JSON array. No markdown, no preamble, no explanation. Just the raw JSON array.

Each object must have exactly these fields:
{
  "title": "Full paper title",
  "authors": "First author et al., Year  (e.g. Smith et al., 2021)",
  "year": "2021",
  "source": "Journal or conference name",
  "url": "https://... (DOI, arXiv, PubMed, or Scholar URL)",
  "abstract_summary": "2-3 sentences: what the paper studied, what methods were used, what was found.",
  "relevance": "2-3 sentences: specifically how this paper supports, informs, or contrasts with the researcher's described work.",
  "cite_sections": ["Introduction", "Related Work"],
  "field_tag": "e.g. Machine Learning",
  "impact": "high|medium"
}

Return the JSON array only.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Strip markdown fences if present
    let clean = text.trim()
    clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()

    const startIdx = clean.indexOf('[')
    const endIdx = clean.lastIndexOf(']')
    if (startIdx === -1 || endIdx === -1) {
      return NextResponse.json({ error: 'Failed to parse response from Gemini. Please try again.' }, { status: 500 })
    }

    const papers = JSON.parse(clean.slice(startIdx, endIdx + 1))

    if (!Array.isArray(papers) || papers.length === 0) {
      return NextResponse.json({ error: 'No papers returned. Try a more specific research description.' }, { status: 500 })
    }

    return NextResponse.json({ papers })

  } catch (err: unknown) {
    console.error('Search API error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Search failed: ${message}` }, { status: 500 })
  }
}
