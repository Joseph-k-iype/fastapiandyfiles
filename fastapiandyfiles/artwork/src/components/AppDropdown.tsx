// src/components/AppDropdown.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AppInfo {
  id: string;
  name: string;
}

interface AppDropdownProps {
  onSelectApp: (appId: string) => void;
}

const AppDropdown: React.FC<AppDropdownProps> = ({ onSelectApp }) => {
  const [apps, setApps] = useState<AppInfo[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/apps')
      .then(response => {
        setApps(response.data.apps);
      })
      .catch(error => console.error('Error fetching apps:', error));
  }, []);

  return (
    <select onChange={e => onSelectApp(e.target.value)} defaultValue="">
      <option value="" disabled>Select an Application</option>
      {apps.map(app => (
        <option key={app.id} value={app.id}>{app.name}</option>
      ))}
    </select>
  );
}

export default AppDropdown;
