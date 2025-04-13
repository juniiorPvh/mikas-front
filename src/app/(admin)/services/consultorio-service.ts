const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const ConsultorioService = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/consultorios`);
        if (!response.ok) {
            throw new Error('Falha ao buscar consultórios');
        }
        return response.json();
    },

    delete: async (id: number) => {
        const response = await fetch(`${API_URL}/consultorios/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Falha ao excluir consultório');
        }
    },

    create: async (data: any) => {
        const response = await fetch(`${API_URL}/consultorios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Falha ao criar consultório');
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
            throw new Error('Falha ao atualizar consultório');
        }
        return response.json();
    },
};