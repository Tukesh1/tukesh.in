import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMetadata {
  title: string;
  description: string;
  image?: string;
  createdAt?: string; // Made optional since we'll auto-generate
  updatedAt?: string; // Made optional since we'll auto-generate
}

export interface Post {
  slug: string;
  metadata: PostMetadata;
  content: string;
  createdAt: string; // Always available after processing
  updatedAt: string; // Always available after processing
  /** Estimated reading time in minutes (rounded up, minimum 1). */
  readingTime: number;
  /** Number of words in the post body. */
  wordCount: number;
}

const POSTS_DIRECTORY = path.join(process.cwd(), 'src/content/post');

const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time from MDX content. Strips common MDX noise
 * (code fences, inline code, frontmatter-ish HTML) before counting words.
 */
export function calculateReadingTime(content: string): { readingTime: number; wordCount: number } {
  const cleaned = content
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`[^`]*`/g, ' ')        // inline code
    .replace(/<[^>]+>/g, ' ')        // JSX/HTML tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // link text only
    .replace(/[#>*_~-]/g, ' ');

  const words = cleaned.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return { readingTime, wordCount };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }

  const fileNames = fs.readdirSync(POSTS_DIRECTORY);
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(POSTS_DIRECTORY, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const fileStat = fs.statSync(fullPath);
      const { data, content } = matter(fileContents);

      // Auto-generate dates if not provided
      const createdAt = data.createdAt || fileStat.birthtime.toISOString().split('T')[0];
      const updatedAt = data.updatedAt || fileStat.mtime.toISOString().split('T')[0];
      const { readingTime, wordCount } = calculateReadingTime(content);

      return {
        slug,
        metadata: data as PostMetadata,
        content,
        createdAt,
        updatedAt,
        readingTime,
        wordCount,
      };
    })
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(POSTS_DIRECTORY, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const fileStat = fs.statSync(fullPath);
    const { data, content } = matter(fileContents);

    // Auto-generate dates if not provided
    const createdAt = data.createdAt || fileStat.birthtime.toISOString().split('T')[0];
    const updatedAt = data.updatedAt || fileStat.mtime.toISOString().split('T')[0];
    const { readingTime, wordCount } = calculateReadingTime(content);

    return {
      slug,
      metadata: data as PostMetadata,
      content,
      createdAt,
      updatedAt,
      readingTime,
      wordCount,
    };
  } catch {
    return null;
  }
}

export function getRecentPosts(limit: number = 3): Post[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, limit);
}
