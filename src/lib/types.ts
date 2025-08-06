export interface Pokemon {
    id: number;
    name: string;
    types: Array<{
      type: {
        name: string;
      };
    }>;
    stats: Array<{
      base_stat: number;
      stat: {
        name: string;
      };
    }>;
    abilities: Array<{
      ability: {
        name: string;
      };
    }>;
    sprites: {
      other: {
        'official-artwork': {
          front_default: string;
        };
      };
    };
  }

  export type Pagination = {
	count: number;
	next: string | null;
	previous: string | null;
};
