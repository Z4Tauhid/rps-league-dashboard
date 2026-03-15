export let matches: any[] = [];

export const setMatches = (data: any[]) => {
  matches = data;
};

export const addMatch = (match: any) => {
  matches.push(match);
};

export const getMatches = () => matches;