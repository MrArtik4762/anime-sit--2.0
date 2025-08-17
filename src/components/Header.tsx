import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{
      backgroundColor: '#8B5CF6',
      color: 'white',
      padding: '1rem',
      textAlign: 'center',
      marginBottom: '2rem',
      borderRadius: '8px'
    }}>
      <h1 style={{ margin: 0, fontSize: '2rem' }}>🎌 AniStream</h1>
      <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', opacity: 0.9 }}>
        Современный клиент Anilibria
      </p>
    </header>
  );
};

export default Header;