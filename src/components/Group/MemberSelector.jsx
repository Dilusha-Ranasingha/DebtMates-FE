import { useState, useEffect } from 'react';
import { searchUsers } from '../../services/api';

const MemberSelector = ({ onSelect, selectedMembers }) => {
  const [query, setQuery] = useState('');
  const [searchBy, setSearchBy] = useState('username'); // Default to username
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (query.length > 2) {
        try {
          setError(null);
          const response = await searchUsers(query, searchBy);
          setUsers(response.data);
        } catch (error) {
          console.error('Failed to search users:', error);
          setError('Failed to search users. Please try again.');
          setUsers([]);
        }
      } else {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [query, searchBy]);

  const handleSelect = (userId) => {
    if (selectedMembers.includes(userId)) {
      onSelect(selectedMembers.filter((id) => id !== userId));
    } else {
      onSelect([...selectedMembers, userId]);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex mb-2">
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="mr-2 p-2 border rounded-lg"
        >
          <option value="username">Search by Username</option>
          <option value="email">Search by Email</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search users by ${searchBy}`}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {users.length > 0 && (
        <ul className="mt-2 bg-white border rounded-lg max-h-40 overflow-y-auto">
          {users.map((user) => (
            <li key={user.id} className="p-2 hover:bg-gray-100 flex items-center">
              <input
                type="checkbox"
                checked={selectedMembers.includes(user.id)}
                onChange={() => handleSelect(user.id)}
                className="mr-2"
              />
              <span onClick={() => handleSelect(user.id)} className="cursor-pointer">
                {user.username} ({user.email})
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2">
        <p>Selected Members: {selectedMembers.length}</p>
        {selectedMembers.length > 0 && (
          <ul className="mt-1">
            {selectedMembers.map((userId) => {
              const user = users.find((u) => u.id === userId);
              return user ? (
                <li key={userId} className="text-sm text-gray-600">
                  {user.username} ({user.email})
                </li>
              ) : null;
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MemberSelector;