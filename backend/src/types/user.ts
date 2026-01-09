export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    contact_info: string;
    location: string;
    role: 'Resident' | 'Helper';
    created_at?: Date;
}

export interface UserCreationParams {
    name: string;
    email: string;
    password: string;
    contact_info: string;
    location: string;
    role: 'Resident' | 'Helper';
}
