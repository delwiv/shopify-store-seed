import {useMatches} from '@remix-run/react';

export const useSettings = () => {
  const [root] = useMatches();
  const {settings} = root.data;

  return settings;
};
