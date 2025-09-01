const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type} " onclick="openModal(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

async function openModal(pokemonId) {
    console.log('Opening modal');

    const pokemonMoreDetail = await pokeApi.getPokemonMoreDetail(pokemonId);
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="modalContent ${pokemonMoreDetail.types[0]}">
            <div class="mainDetailInfo">
                <h2>${pokemonMoreDetail.name}</h2>
                <ul class="types">
                    ${pokemonMoreDetail.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ul>
                <img src="${pokemonMoreDetail.photo}" alt="${pokemonMoreDetail.name}">
            </div>
            <div class="additionalInfo">
                <span>Abilities<span>
                <ul class="stats">
                    ${pokemonMoreDetail.stats.map((stat) => `
                        <li class="stat">
                            <span class="name">${stat.name}</span>: <span class="value">${stat.base}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

const closeModalButton = document.getElementById('closeModal');

closeModalButton.addEventListener('click', closeModal);

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})