/**
 * API Client for HealthSecure Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Token management
export const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
};

export const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('refresh_token');
    }
    return null;
};

export const setTokens = (access: string, refresh: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    }
};

export const clearTokens = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }
};

export const setUser = (user: UserInfo) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

export const getUser = (): UserInfo | null => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    return null;
};

// Types
export interface UserInfo {
    email: string;
    role: 'PATIENT' | 'DOCTOR';
    name: string;
    health_id?: string;
    doctor_id?: string;
    is_verified?: boolean;
}

export interface PatientProfile {
    health_id: string;
    first_name: string;
    last_name: string;
    age: number | null;
    email: string;
    phone: string;
}

export interface DoctorProfile {
    doctor_id: string;
    first_name: string;
    last_name: string;
    medical_license: string;
    specialization: string;
    hospital: string;
    is_verified: boolean;
    email: string;
    phone: string;
}

export interface MedicalRecord {
    id: number;
    record_type: string;
    record_type_display: string;
    diagnosis: string;
    notes: string;
    document: string | null;
    is_visible: boolean;
    created_at: string;
    doctor_name: string;
    hospital: string;
    patient_name: string;
    patient_health_id: string;
}

export interface ApiError {
    message: string;
    details?: Record<string, string[]>;
}

export interface DashboardStats {
    // Patient stats
    total_records?: number;
    unique_doctors?: number;
    last_visit?: string;
    visible_records?: number;
    hidden_records?: number;
    // Doctor stats
    unique_patients?: number;
    last_activity?: string;
}


// Base fetch with auth
async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = getAccessToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Handle token refresh if unauthorized
    if (response.status === 401 && getRefreshToken()) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${getAccessToken()}`;
            return fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });
        }
    }

    return response;
}

// Auth APIs
export async function loginUser(email: string, password: string): Promise<UserInfo> {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    setTokens(data.access, data.refresh);

    const userInfo: UserInfo = {
        email: data.email,
        role: data.role,
        name: data.name || data.email,
        health_id: data.health_id,
        doctor_id: data.doctor_id,
        is_verified: data.is_verified,
    };

    setUser(userInfo);
    return userInfo;
}

export async function registerPatient(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    age?: number;
    phone?: string;
}): Promise<{ health_id: string; email: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register/patient/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(Object.values(error).flat().join(', ') || 'Registration failed');
    }

    return response.json();
}

export async function registerDoctor(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    medical_license: string;
    specialization: string;
    hospital: string;
    phone?: string;
}): Promise<{ doctor_id: string; email: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register/doctor/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(Object.values(error).flat().join(', ') || 'Registration failed');
    }

    return response.json();
}

export async function refreshAccessToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            clearTokens();
            return false;
        }

        const data = await response.json();
        setTokens(data.access, data.refresh || refreshToken);
        return true;
    } catch {
        clearTokens();
        return false;
    }
}

export function logout() {
    clearTokens();
    window.location.href = '/login';
}

// Profile APIs
export async function getProfile(): Promise<{ role: string; profile: PatientProfile | DoctorProfile }> {
    const response = await fetchWithAuth('/auth/profile/');

    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }

    return response.json();
}

export async function updateProfile(data: Partial<PatientProfile | DoctorProfile>): Promise<PatientProfile | DoctorProfile> {
    const response = await fetchWithAuth('/auth/profile/', {
        method: 'PUT',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update profile');
    }

    return response.json();
}

// Dashboard Stats API
export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await fetchWithAuth('/auth/stats/');

    if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
}

// Medical Records APIs
export async function getRecords(): Promise<MedicalRecord[]> {
    const response = await fetchWithAuth('/records/');

    if (!response.ok) {
        throw new Error('Failed to fetch records');
    }

    return response.json();
}

export async function createRecord(data: {
    patient_health_id: string;
    record_type: string;
    diagnosis: string;
    notes: string;
}): Promise<MedicalRecord> {
    const response = await fetchWithAuth('/records/', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create record');
    }

    return response.json();
}

export async function toggleRecordVisibility(recordId: number): Promise<{ is_visible: boolean }> {
    const response = await fetchWithAuth(`/records/${recordId}/visibility/`, {
        method: 'PATCH',
    });

    if (!response.ok) {
        throw new Error('Failed to toggle visibility');
    }

    return response.json();
}

export async function searchPatient(healthId: string): Promise<{
    health_id: string;
    name: string;
    age: number | null;
}> {
    const response = await fetchWithAuth(`/auth/patients/${healthId}/`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Patient not found');
        }
        throw new Error('Failed to search patient');
    }

    return response.json();
}

export async function getPatientRecords(healthId: string): Promise<{
    patient: { health_id: string; name: string; age: number | null };
    records: MedicalRecord[];
}> {
    const response = await fetchWithAuth(`/patients/${healthId}/records/`);

    if (!response.ok) {
        throw new Error('Failed to fetch patient records');
    }

    return response.json();
}

// Utility to check if user is authenticated
export function isAuthenticated(): boolean {
    return !!getAccessToken();
}
