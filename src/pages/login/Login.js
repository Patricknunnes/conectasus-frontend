import { useState } from 'react';
import './Login.scss';

export function Login(props) {

    const { onLogin } = props;

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const login = () => {
        alert(`username -> ${username}, password -> ${password}`);
        onLogin(true);
    }

    return(<div className="login">
        <div className="login-container">
            <div className="container login-banner">
                <div className="logo"></div>
            </div>
            <div className="container d-flex flex-column justify-content-center align-items-center">
                <div className="row">
                    <label for="username" className="label">Usuário</label>
                    <input onChange={({ target }) => setUsername(target.value)} id="username" class="form-control" type="text" />
                </div>

                <div className="row">
                    <label for="password" className="label">Senha</label>
                    <input onChange={({ target }) => setPassword(target.value)} id="password" class="form-control" type="password" />
                </div>
                <br/>
                <button onClick={login} className="btn btn-dark">Entrar</button>
            </div>
        </div>
    </div>);
}