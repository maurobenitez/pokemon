import './App.css';
import {Route} from "react-router-dom";
import PokemonList from './components/home/pokemonList/PokemonList';
import PokemonDetail from './components/detail/PokemonDetail';
import LandingPage from './components/landingPage/LandingPage';
import CreatePokemon from './components/createPokemon/CreatePokemon';
import Search from './components/home/search/Search';
import Filters from './components/home/filters/Filters';
import Pagination from './components/home/pagination/Pagination';

function App() {
  return (
    <div className="App">
      <Route path="/" exact component={LandingPage}/>
      <Route path="/pokemons" exact component={Search}/>
      <Route path="/pokemons" exact component={Filters}/>
      <Route path="/pokemons" exact component={PokemonList}/>
      <Route path="/pokemons" exact component={Pagination}/>
      <Route path="/pokemon/:id" exact component={PokemonDetail}/>
      <Route path="/pokemons/create" exact component={CreatePokemon}/>
    </div>
  );
}

export default App;
