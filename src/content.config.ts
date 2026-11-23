import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sectors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sectors' }),
  schema: z.object({
    title: z.string(),
    keyword: z.string(),
    metaDescription: z.string(),
    heroImage: z.string().optional(),
    summary: z.string(),
    order: z.number().default(0),
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: z.object({
    title: z.string(),
    keyword: z.string(),
    metaDescription: z.string(),
    summary: z.string(),
    order: z.number().default(0),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/caseStudies' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    sector: z.string(),
    location: z.string(),
    sqFt: z.number(),
    durationWeeks: z.number(),
    outcome: z.string(),
    placeholder: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    publishDate: z.date(),
    summary: z.string(),
    readTime: z.string().optional(),
    order: z.number().default(0),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  }),
});

export const collections = { sectors, locations, caseStudies, insights };
