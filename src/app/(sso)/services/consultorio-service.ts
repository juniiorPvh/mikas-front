const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const ConsultorioService = {
    create: async (data: any) => {
        const response = await fetch(`${API_URL}/consultorios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error('Failed to create consultório');
        }
        
        return response.json();
    },

    update: async (id: number, data: any) => {
        const response = await fetch(`${API_URL}/consultorios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update consultório');
        }
        
        return response.json();
    },
};