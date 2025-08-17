import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#8B5CF6' }}>🎌 Минимальное Anime приложение</h1>
      <p>Если вы видите этот текст, значит базовый рендеринг работает!</p>
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        border: '2px solid #8B5CF6', 
        borderRadius: '8px' 
      }}>
        <p>✅ Приложение успешно загружено</p>
        <p>🚀 Vite + React работают правильно</p>
      </div>
    </div>
  );
};

export default App;
