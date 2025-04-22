import Link from 'next/link';

interface UserCardProps {
  user: {
    id: string;
    name: string | null;
    bio: string | null;
    profile_picture: string | null;
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link href={`/users/${user.id}`}>
      <div className="bg-[var(--neutral-light)] p-6 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)] hover:shadow-[6px_6px_0px_var(--neutral-dark)] transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[var(--neutral-light)] rounded-full border-2 border-[var(--neutral-dark)]">
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={user.name || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                👤
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] hover:text-[var(--secondary-cyan)] transition-colors duration-150">
              {user.name || 'Anonymous User'}
            </h3>
            <p className="text-gray-600 line-clamp-2">
              {user.bio || 'No bio available'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
