import logo from './logo.svg';
import './App.css';

import Login from "./presenters/login.js";


function App() {
  require('dotenv').config();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
         Hej
        </p>
        <Login></Login>
     
      </header>
    </div>
  );
}

export default App;
