import type { ComponentType } from 'react';
import {
  BarChart3,
  Camera,
  Gauge,
  History,
  Image,
  MessageSquareText,
  Mic,
  Settings,
  Type,
} from 'lucide-react';
import type { NavigationKey } from '../types';

const items: Array<{ key: NavigationKey; label: string; icon: ComponentType<{ className?: string }> }> = [
  { key: 'dashboard', label: 'Dashboard', icon: Gauge },
  { key: 'live', label: 'Live Sign Detection', icon: Camera },
  { key: 'speech', label: 'Speech To Sign', icon: Mic },
  { key: 'text', label: 'Text To Sign', icon: Type },
  { key: 'image', label: 'Image Translation', icon: Image },
  { key: 'conversation', label: 'Conversation Mode', icon: MessageSquareText },
  { key: 'history', label: 'History', icon: History },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ active, onNavigate }: { active: NavigationKey; onNavigate: (key: NavigationKey) => void }) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand" aria-label="SignBridge AI home">
        <div className="brand-mark">SB</div>
        <div>
          <p className="eyebrow">SignBridge</p>
          <h1>AI Assistant</h1>
        </div>
      </div>
      <nav className="nav-list">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.key}
              className={`nav-item ${active === item.key ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
              aria-current={active === item.key ? 'page' : undefined}
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <BarChart3 className="nav-icon" />
        <span>90%+ accuracy target</span>
      </div>
    </aside>
  );
}
