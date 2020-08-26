import { h } from 'preact';
import { HashRouter, NavLink, Route, Redirect } from 'react-router-dom';
import History from './history';
import Settings from './settings';


const Options = () => {
    return (
        <HashRouter>
            <div class="options">
                <header>
                    <div class="brand">
                        Slide URL Recognition
                    </div>
                    <nav>
                        <NavLink activeClassName="active" to="/history">History</NavLink>
                        <NavLink activeClassName="active" to="/settings">Settings</NavLink>
                    </nav>
                </header>
                <div class="content">
                    <Route exact path='/'>
                        <Redirect to="/settings" />
                    </Route>
                    <Route path='/history'>
                        <History />
                    </Route>
                    <Route path='/settings'>
                        <Settings />
                    </Route>
                </div>
            </div>
        </HashRouter>
    )
}

export default Options;
