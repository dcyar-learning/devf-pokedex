import Pokedex from "./pokedex.js";

const pokedex = new Pokedex();

const pokemonList = document.getElementById('pokemons-list');

window.addEventListener('load', async function () {
  const pokemons = await pokedex.getAllPokemons();

  printPokemons(pokemons);
});

document.getElementById('searchForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const searchInput = this.elements['pokemonName'].value.trim();
  const messages = document.getElementById('messages');

  if (!searchInput) {
    messages.innerHTML = `<div class="alert alert-danger" role="alert">
    The name field cannot be empty!
    </div>`

    return;
  }

  const pokemon = await pokedex.getPokemon(searchInput);

  pokemonList.innerHTML = '';

  if (!pokemon) {
    messages.innerHTML = `<div class="alert alert-danger" role="alert">
      Pokemon not found!
    </div>`;
    return;
  }

  messages.innerHTML = '';

  printPokemon(pokemon);
});

function printPokemons(pokemons) {
  pokemons.forEach(printPokemon)
}

async function printPokemon(p) {
  const pokemon = await pokedex.getPokemon(p.name);

  const pokemonCardElement = document.createElement('div');
  pokemonCardElement.classList.add('col-12', 'col-sm-12', 'col-md-4', 'col-lg-3', 'my-2');

  pokemonCardElement.innerHTML = `
    <div class="card w-100" style="cursor: pointer;" data-name="${pokemon.name}">
      <div style="background: rgb(34,193,195); background: linear-gradient(77deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);">
        <img
          src="${pokemon.sprites.front_default}"
          class="card-img-top"
          alt="${pokemon.name}"
        />
      </div>
      <div class="card-body">
        <h5 class="card-title text-capitalize">${pokemon.name}</h5>
      </div>
      <ul class="list-group list-group-flush">
      <li class="list-group-item"><strong>Order:</strong> ${pokemon.order}</li>
        <li class="list-group-item"><strong>Type:</strong> ${(pokemon.types.map(type => ' ' + type.type.name))}</li>
      </ul>
    </div>
  `;

  pokemonList.appendChild(pokemonCardElement);

  pokemonCardElement.addEventListener('click', showPokemon);
}

async function showPokemon() {
  const myModal = new bootstrap.Modal(document.getElementById('myModal'), { keyboard: true, backdrop: true, focus: false });
  const modalContentElement = document.getElementById('modalContent');

  const pokemonCard = this.firstElementChild;

  const pokemon = await pokedex.getPokemon(pokemonCard.dataset.name);

  let pokemonStats = '';

  pokemon.stats.forEach(s => pokemonStats += `
    <tr>
      <th scope="row" class="text-capitalize">${s.stat.name}:</th>
      <td colspan="2">${s.base_stat}</td>
    </tr>
  `)

  modalContentElement.innerHTML = `
    <div class="modal-header">
      <h5 class="modal-title text-capitalize" id="title">${pokemon.name}</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
    <div class="modal-body row align-items-center">
      <div class="col-12 col-sm-12 col-md-4 col-lg-3">
        <img
          style="width: 100%;"
          src="${pokemon.sprites.front_default}"
          alt="${pokemon.name}"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-6 col-lg-9 table-responsive">
        <table class="table table-sm table-striped align-middle">
          <tbody>
            <tr>
              <th scope="row">Weight:</th>
              <td>${pokemon.weight}</td>
            </tr>
            <tr>
              <th scope="row">Height:</th>
              <td>${pokemon.height}</td>
            </tr>
            <tr>
              <th scope="row">Abilitites:</th>
              <td colspan="2">${(pokemon.abilities.map(a => ' ' + a.ability.name))}</td>
            </tr>
            <tr>
              <th scope="row">Abilitites:</th>
              <td colspan="2">${(pokemon.types.map(t => ' ' + t.type.name))}</td>
            </tr>
            ${pokemonStats}
          </tbody>
        </table>
      </div>
    </div>
  `;

  myModal.show();
}
