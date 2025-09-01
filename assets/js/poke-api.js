
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

function convertPokeApiMoreDetailToPokemonMoreDetail(pokeDetail) {
    const pokemon = new PokemonMoreDetail()
    pokemon.id = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    pokemon.types = types

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    //const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)
    //pokemon.abilities = abilities

    const stats = pokeDetail.stats.map((statSlot) => ({
        name: statSlot.stat.name,
        base: statSlot.base_stat
    }))
    pokemon.stats = stats
    console.log(`Pokemon loaded`);
    console.log(pokemon);
    return pokemon
}

pokeApi.getPokemonMoreDetail = async (pokemonId) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    return convertPokeApiMoreDetailToPokemonMoreDetail(data);
}

