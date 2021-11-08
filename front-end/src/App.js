
/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import './App.css';
// Local
import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import Login from './Login'
import Layout from './components/Layout';
import LayoutLogin from './components/LayoutLogin';

const styles = {
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fefefe',
  },
}

export default function App() {
  const [user, setUser] = useState(null)
  return (
    <div className="App" css={styles.root}>
      
        {
          user ? <Layout><Main /></Layout>: <LayoutLogin><Login onUser={setUser} /></LayoutLogin>
        }
      
    </div>
  );
}

