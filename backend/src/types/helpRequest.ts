export interface HelpRequest {
    id: number;
    resident_id: number;
    helper_id?: number | null;
    title: string;
    description: string;
    category: string;
    status: 'Pending' | 'Accepted' | 'In-progress' | 'Completed';
    attachments?: string;
    created_at?: Date;
    resident_name?: string; // For display purposes
    helper_name?: string;   // For display purposes
}

export interface CreateRequestParams {
    resident_id: number;
    title: string;
    description: string;
    category: string;
    attachments?: string;
}
