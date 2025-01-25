import { useState, useEffect } from 'react';
import { Input } from '@telegram-apps/telegram-ui';

function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('deepseek_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('deepseek_api_key', apiKey.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="settings">
      <h1 className='header'>Settings</h1>
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <Input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            header='DeepSeek API Key:'
            placeholder="Enter your DeepSeek API key"
          />
        </div>
        <div className="button-group">
          <Input type="submit" value="Save" />
        </div>
        {isSaved && <div className="success-message">Settings saved successfully!</div>}
      </form>
    </div>
  );
}

export default Settings;