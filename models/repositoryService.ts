import { Repository } from './Repository';

const URL =
  'https://api.github.com/search/repositories?q=language:swift&sort=stars&order=desc';

type SearchResponse = {
  items: Repository[];
};

export async function fetchRepositories(): Promise<Repository[]> {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data: SearchResponse = await response.json();
    return data.items ?? [];
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
}
