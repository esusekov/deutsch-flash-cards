import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

function App() {
  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();
    
    // Set the main button if needed
    WebApp.MainButton.setText('Click Me!');
    WebApp.MainButton.onClick(() => {
      WebApp.showAlert('Hello from Telegram Mini App!');
    });
    WebApp.MainButton.show();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to Telegram Mini App</h1>
      </header>
      <main className="app-content">
        <p>This is a simple Telegram Mini App demo.</p>
        <p>User: {WebApp.initDataUnsafe.user?.first_name || 'Guest'}</p>
      </main>
    </div>
  );
}

export default App;