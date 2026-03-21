//phân quyền giao diện
export type LoginRequest = {
    email: string;
    password: string;
}

export type User = {
    id: number;
    name: string;
    role: 'student' | 'instructor' | 'admin';
    token: string;
}