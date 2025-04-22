interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search members..."
          className="w-full px-4 py-3 rounded-lg border-2 border-black 
                     bg-white text-black placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-cyan-500
                     comic-shadow-hard"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
          🔍
        </span>
      </div>
    </div>
  );
}
