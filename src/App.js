import { useEffect, useState } from 'react';
import { Login } from './pages/login/Login';
import { Main } from './pages/main/Main';
import './App.css';

function App() {

  const [isLogged, setLogged] = useState(false);

  useEffect(() => {
    if (isLogged) {
      alert('fez login');
    }
  }, [isLogged])

  return (<div className="full-width h-100">
    {
      (!isLogged) ? 
        <Login onLogin={(isLogged) => setLogged(isLogged)} />
      :
        <Main onExit={() => setLogged(false)} />
    }
  </div>
  );
}

export default App;
