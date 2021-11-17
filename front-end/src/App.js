
/** @jsxImportSource @emotion/react */
import { createContext } from 'react';
import { useState } from 'react';
import './App.css';
// Local
import Main from './Main'
import Login from './Login'
import Layout from './components/Layout';
import LayoutLogin from './components/LayoutLogin';
//Context
const styles = {
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fefefe',
  },
}

export const Context = createContext('Default Value');
export default function App() {
  const [user, setUser] = useState(null)
  return (
    <div className="App" css={styles.root}>
      {
        user ? <Context.Provider value={user}>
          <Layout>
            <Main />
          </Layout></Context.Provider>
          : <LayoutLogin><Login onUser={setUser} /></LayoutLogin>
      }

    </div>
  );
}

