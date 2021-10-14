export default class Pokedex {
  constructor() {
    this._URI = 'https://pokeapi.co/api/v2';
  }

  async getAllPokemons() {
    try {
      const response = await fetch(`${this._URI}/pokemon?limit=10`);
      const data = await response.json();

      return data.results.map((pokemon) => ({
        name: pokemon.name,
        url: pokemon.url
      }));
    } catch (error) {
      console.error(err);
    }
  }

  async getPokemon(name) {
    try {
      const response = await fetch(`${this._URI}/pokemon/${name}`);
      const data = await response.json();

      return data;
    } catch (err) {
      console.log(err)
    }
  }

  // get uri() {
  //   return this._URI;
  // }
}