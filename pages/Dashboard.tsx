import React, { useEffect, useState } from 'react';
import { Api } from '../services/mockApi';
import { HelpRequest, User, UserRole } from '../types';
import { HelpRequestCard } from '../components/HelpRequestCard';

interface DashboardProps {
  user: User;
  onSelectRequest: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSelectRequest }) => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'my_accepted'>('all');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let data: HelpRequest[] = [];
      if (user.role === UserRole.RESIDENT) {
        data = await Api.getRequestsByResident(user.id);
      } else {
        // Helper
        data = await Api.getRequestsForHelper();
      }
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Filter logic for helpers
  const displayedRequests = requests.filter(r => {
      if (user.role === UserRole.RESIDENT) return true;
      if (filter === 'all') return true;
      if (filter === 'my_accepted') return r.helper_id === user.id;
      return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          {user.role === UserRole.RESIDENT ? 'My Requests' : 'Community Requests'}
        </h2>
        
        {user.role === UserRole.HELPER && (
             <div className="flex bg-gray-100 p-1 rounded-lg">
                 <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                     All Available
                 </button>
                 <button
                    onClick={() => setFilter('my_accepted')}
                    className={`px-3 py-1 text-sm rounded-md ${filter === 'my_accepted' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                     My Tasks
                 </button>
             </div>
        )}
      </div>

      {loading ? (
          <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
      ) : (
        <>
          {displayedRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
               <span className="material-icons text-gray-400 text-4xl mb-2">inbox</span>
               <p className="text-gray-500 text-lg">No requests found.</p>
               {user.role === UserRole.RESIDENT && (
                   <p className="text-sm text-gray-400">Click "Request Help" to create one!</p>
               )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedRequests.map((req) => (
                <HelpRequestCard 
                    key={req.id} 
                    request={req} 
                    currentUserRole={user.role} 
                    onClick={onSelectRequest}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;