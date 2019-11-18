import React from 'react';
import HomePage from '../home';
import ProjectPage from '../projects';
import { Switch, Route, Router } from '../../util/router';
// import analytics from './../../util/analytics';
import { ProvideAuth } from '../../util/auth';
import './styles.scss';

function App() {
  return (
    <Router>
      <ProvideAuth>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/projects" component={ProjectPage} />

          <Route
            component={({ location }) => {
              return (
                <div
                  style={{
                    padding: '50px',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  The page <code>{location.pathname}</code> could not be found.
                </div>
              );
            }}
          />
        </Switch>
      </ProvideAuth>
    </Router>
  );
}

export default App;
