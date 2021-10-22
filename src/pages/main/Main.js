import './Main.scss';

export function Main(props) {

    const { onExit } = props;

    return(<div className="main h-100">
        <header> Header </header>
        <div className="container">
            Content
        </div>
        <footer>Footer</footer>
        <br/>
        <div className="row justify-content-end">
            <div className="col">
                <button onClick={() => onExit()} className="btn btn-lg btn-danger">Sair</button>
            </div>
        </div>
    </div>);
}