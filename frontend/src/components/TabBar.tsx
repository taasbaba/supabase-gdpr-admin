import React from 'react';

interface TabBarProps {
  active: string;
  onChange: (tab: 'profile' | 'admin' | 'token') => void;
}

const TabBar: React.FC<TabBarProps> = ({ active, onChange }) => {
  return (
    <ul className="nav nav-tabs">
      {['profile', 'admin', 'token'].map((tab) => (
        <li className="nav-item" key={tab}>
          <button
            className={`nav-link ${active === tab ? 'active' : ''}`}
            onClick={() => onChange(tab as any)}
          >
            {tab.toUpperCase()}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TabBar;
