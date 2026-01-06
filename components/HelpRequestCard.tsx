import React from 'react';
import { HelpRequest, RequestStatus, UserRole } from '../types';

interface HelpRequestCardProps {
  request: HelpRequest;
  currentUserRole: UserRole;
  onClick: (id: string) => void;
}

export const HelpRequestCard: React.FC<HelpRequestCardProps> = ({ request, currentUserRole, onClick }) => {
  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case RequestStatus.ACCEPTED: return 'bg-blue-100 text-blue-800';
      case RequestStatus.IN_PROGRESS: return 'bg-purple-100 text-purple-800';
      case RequestStatus.COMPLETED: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
        onClick={() => onClick(request.id)}
        className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-start mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status}
            </span>
            <span className="text-xs text-gray-500">
                {new Date(request.created_at).toLocaleDateString()}
            </span>
        </div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 truncate">
          {request.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">
          {request.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
                <span className="material-icons text-gray-400 text-sm mr-1">person</span>
                {request.resident_name}
            </div>
            <div className="flex items-center">
                 <span className="material-icons text-gray-400 text-sm mr-1">category</span>
                 {request.category}
            </div>
        </div>
        {request.helper_name && (
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center text-xs text-indigo-600">
                <span className="material-icons text-xs mr-1">verified</span>
                Helper: {request.helper_name}
            </div>
        )}
      </div>
    </div>
  );
};