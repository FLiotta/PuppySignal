import { Specie } from 'interfaces/app';

export const selectSpecies = (state: any) => state.species.results;
export const selectSpeciesTotal = (state: any) => state.species.total;
export const getSpecieById = (state: any, specieId: number) => state.species?.results.find((specie: Specie) => specie.id === specieId);