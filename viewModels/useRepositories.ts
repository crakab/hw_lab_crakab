import { useEffect, useMemo, useState } from 'react';
import { Repository } from '../models/Repository';
import { fetchRepositories } from '../models/repositoryService';

export function filterRepositories(repos: Repository[], searchText: string): Repository[] {
  if (searchText.trim() === '') return repos;
  const needle = searchText.toLowerCase();
  return repos.filter((r) => r.name.toLowerCase().includes(needle));
}

export function useRepositories() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const fetched = await fetchRepositories();
      if (!cancelled) {
        setRepos(fetched);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRepos = useMemo(
    () => filterRepositories(repos, searchText),
    [repos, searchText]
  );

  return { repos, filteredRepos, searchText, setSearchText, loading };
}
