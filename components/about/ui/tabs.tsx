// Tab Component
interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{ id: string; label: string; icon: React.ReactNode }>;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange, tabs }) => (
  <div className="flex justify-center mb-8">
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

export default Tabs;
