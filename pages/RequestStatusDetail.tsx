import React, { useEffect, useState } from 'react';
import { Api } from '../services/api';
import { HelpRequest, RequestStatus, User, UserRole } from '../types';
import { ChatComponent } from '../components/ChatComponent';

interface RequestStatusDetailProps {
  requestId: string;
  user: User;
  onBack: () => void;
}

const RequestStatusDetail: React.FC<RequestStatusDetailProps> = ({ requestId, user, onBack }) => {
  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const fetchRequest = async () => {
    try {
      const data = await Api.getRequestById(requestId);
      if (data) setRequest(data);
      else alert('Request not found');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
    // Simple poll
    const interval = setInterval(fetchRequest, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const handleStatusUpdate = async (newStatus: RequestStatus) => {
    if (!request) return;
    setActionLoading(true);
    try {
      await Api.updateRequestStatus(request.id, newStatus, user.id, user.name);
      await fetchRequest();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading details...</div>;
  if (!request) return <div className="p-10 text-center text-red-500">Request not found</div>;

  const isHelper = user.role === UserRole.HELPER;
  const isOwner = request.resident_id === user.id;
  
  // Logic to determine if current user is the assigned helper
  const isAssignedHelper = request.helper_id === user.id;

  const canAccept = isHelper && request.status === RequestStatus.PENDING;
  const canStart = isHelper && isAssignedHelper && request.status === RequestStatus.ACCEPTED;
  const canComplete = isHelper && isAssignedHelper && request.status === RequestStatus.IN_PROGRESS;

  // Chat availability rule: Request must not be PENDING, and user must be owner or assigned helper.
  const isChatAvailable = request.status !== RequestStatus.PENDING && (isOwner || isAssignedHelper);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button 
        onClick={onBack}
        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center mb-4"
      >
        <span className="material-icons text-sm mr-1">arrow_back</span> Back to List
      </button>

      {/* Header Card */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl leading-6 font-medium text-gray-900">
              {request.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Posted by {request.resident_name} on {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-end">
             <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                ${request.status === RequestStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : ''}
                ${request.status === RequestStatus.ACCEPTED ? 'bg-blue-100 text-blue-800' : ''}
                ${request.status === RequestStatus.IN_PROGRESS ? 'bg-purple-100 text-purple-800' : ''}
                ${request.status === RequestStatus.COMPLETED ? 'bg-green-100 text-green-800' : ''}
             `}>
                {request.status}
             </span>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {request.description}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {request.category}
              </dd>
            </div>
             <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assigned Helper</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {request.helper_name ? request.helper_name : <span className="text-gray-400 italic">No helper yet</span>}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Action Bar for Helpers */}
      {isHelper && (
        <div className="bg-white p-6 shadow sm:rounded-lg flex flex-col sm:flex-row items-center justify-between border-t-4 border-indigo-500">
           <div>
               <h4 className="text-lg font-medium text-gray-900">Helper Actions</h4>
               <p className="text-sm text-gray-500">Manage the workflow of this request.</p>
           </div>
           <div className="mt-4 sm:mt-0 space-x-3">
               {canAccept && (
                   <button
                    onClick={() => handleStatusUpdate(RequestStatus.ACCEPTED)}
                    disabled={actionLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                   >
                       Accept Request
                   </button>
               )}
               {canStart && (
                    <button
                    onClick={() => handleStatusUpdate(RequestStatus.IN_PROGRESS)}
                    disabled={actionLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                   >
                       Start Work
                   </button>
               )}
               {canComplete && (
                   <button
                    onClick={() => handleStatusUpdate(RequestStatus.COMPLETED)}
                    disabled={actionLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                   >
                       Mark Complete
                   </button>
               )}
               {!canAccept && !canStart && !canComplete && request.status !== RequestStatus.COMPLETED && !isAssignedHelper && (
                   <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                       This request is assigned to another helper.
                   </span>
               )}
               {request.status === RequestStatus.COMPLETED && (
                    <span className="text-sm font-bold text-green-600 flex items-center">
                        <span className="material-icons text-sm mr-1">check_circle</span> Completed
                    </span>
               )}
           </div>
        </div>
      )}

      {/* Resident View Info */}
      {isOwner && (
           <div className="bg-blue-50 p-4 rounded-md flex items-start">
               <span className="material-icons text-blue-400 mr-2">info</span>
               <div className="text-sm text-blue-700">
                   <p className="font-medium">Status Tracking</p>
                   <p>You can track the progress of your request here. When a helper accepts it, their name will appear above.</p>
               </div>
           </div>
      )}

      {/* Chat Section */}
      {isChatOpen ? (
          <ChatComponent 
            requestId={request.id} 
            currentUser={user} 
            onClose={() => setIsChatOpen(false)} 
          />
      ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <span className="material-icons text-gray-400 text-3xl mb-2">chat</span>
              <h4 className="text-gray-900 font-medium">Message Board</h4>
              <p className="text-gray-500 text-sm mb-4">Chat is available between the resident and the assigned helper.</p>
              
              {isChatAvailable ? (
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="px-4 py-2 border border-transparent bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 shadow-sm"
                  >
                      Open Chat
                  </button>
              ) : (
                  <button 
                    disabled
                    className="px-4 py-2 border border-gray-300 bg-white text-gray-400 rounded-md text-sm cursor-not-allowed"
                    title={request.status === RequestStatus.PENDING ? "Wait for a helper to accept the request" : "Only assigned helper can chat"}
                  >
                      Chat Unavailable
                  </button>
              )}
              {request.status === RequestStatus.PENDING && (
                  <p className="text-xs text-gray-400 mt-2">Chat unlocks once a helper accepts the request.</p>
              )}
          </div>
      )}
    </div>
  );
};

export default RequestStatusDetail;