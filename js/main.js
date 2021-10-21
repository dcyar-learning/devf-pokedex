import Pokedex from "./pokedex.js";

const pokedex = new Pokedex();

const pokemonList = document.getElementById('pokemons-list');

window.addEventListener('load', loadPokemons);

document.getElementById('searchForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const searchInput = this.elements['pokemonName'].value.trim();
  const messages = document.getElementById('messages');

  if (!searchInput) {
    pokemonList.innerHTML = '';

    await loadPokemons();

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

async function loadPokemons() {
  const pokemons = await pokedex.getAllPokemons();

  printPokemons(pokemons);
}

function printPokemons(pokemons) {
  pokemons.forEach(printPokemon)
}

async function printPokemon(p) {
  const pokemon = await pokedex.getPokemon(p.name);

  const pokemonCardElement = document.createElement('div');
  pokemonCardElement.classList.add('col-12', 'col-sm-12', 'col-md-4', 'col-lg-3', 'my-2');

  const types = pokemon.types.map(t => t.type.name);

  const bgColor = types.includes('grass') ? '#B8E3CF' : (types.includes('fire') ? '#FCEDC2' : (types.includes('water') ? '#DCEBFF' : (types.includes('bug') ? '#c5d3af' : (types.includes('poison') ? '#c5afd3' : (types.includes('ground') ? '#d3bdaf' : (types.includes('normal') ? '#e5e5e5' : (types.includes('electric') ? '#fdffba' : (types.includes('fairy') ? '#d1afd3' : (types.includes('fighting') ? '#afd3d3' : (types.includes('ice') ? '#bafffa' : (types.includes('psychic') ? '#fff3ba' : (types.includes('dragon') ? '#ffbada' : (types.includes('rock') ? '#c1b5a2' : (types.includes('flying') ? '#a5e5d6' : '#000000'))))))))))))));

  pokemonCardElement.innerHTML = `
    <div class="card w-100" style="cursor: pointer;" data-name="${pokemon.name}">
      <div style="background: ${bgColor};">
        <span class="py-1 px-2 position-absolute top-0 end-0 fs-6 fw-bold">${pokemon.order}</span>
        <img
          src="${pokemon.sprites.front_default}"
          class="card-img-top"
          alt="${pokemon.name}"
        />
      </div>
      <div class="card-body">
        <h5 class="card-title text-capitalize text-center">${pokemon.name}</h5>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item text-center">${types.map(type => `<h5 class="d-inline px-2"><span class="badge rounded-pill text-secondary" style="background-color: ${(type == 'grass' ? '#B8E3CF' : (type == 'fire' ? '#FCEDC2' : (type == 'water' ? '#DCEBFF' : (type == 'bug' ? '#c5d3af' : (type == 'poison' ? '#c5afd3' : (type == 'ground' ? '#d3bdaf' : (type == 'normal' ? '#e5e5e5' : (type == 'electric' ? '#fdffba' : (type == 'fairy' ? '#d1afd3' : (type == 'fighting' ? '#afd3d3' : (type == 'ice' ? '#bafffa' : (type == 'psychic' ? '#fff3ba' : (type == 'dragon' ? '#ffbada' : (type == 'rock' ? '#c1b5a2' : (type == 'flying' ? '#a5e5d6' : '#000000')))))))))))))))};">${type}</span></h5>`).join(' ')}</li>
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
