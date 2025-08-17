import React from 'react';

const DebugPage: React.FC = () => {
  return (
    <div className="p-6 text-dark bg-dark min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug page</h1>
      <p><strong>Vite env:</strong></p>
      <pre>{JSON.stringify(import.meta.env, null, 2)}</pre>
      <p><strong>Document readyState:</strong> {document.readyState}</p>
      <p><strong>Root element exists:</strong> {Boolean(document.getElementById('root')).toString()}</p>
      <p><strong>Last saved error (localStorage 'lastAppError'):</strong></p>
      <pre>{localStorage.getItem('lastAppError') ?? 'none'}</pre>
    </div>
  );
};

export default DebugPage;