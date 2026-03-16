export let matches: any[] = [];

export const setMatches = (data: any[]) => {
  matches = data;
};

export const addMatch = (match: any) => {

  const newMatch = {
    ...match,
    time: Date.now()   
  };

  matches.push(newMatch);
};

export const getMatches = () => matches;