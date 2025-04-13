import { Consultorio } from '@/app/@types/consultorio';
import { Usuario } from '@/app/@types/usuario';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const UsuarioService = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/usuarios`);
        if (!response.ok) {
            throw new Error('Falha ao buscar usuários');
        }
        return response.json();
    },

    getAllByIdConsultorio: async (consultorio: Consultorio) => {
        const response = await fetch(`${API_URL}/usuarios/consultorio/${consultorio.id}`);
        if (!response.ok) {
            throw new Error('Falha ao buscar usuários do consultório selecionado');
        }
        return response.json();
    },

    create: async (data: Omit<Usuario, 'id'>) => {
        console.log(`oi`)
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error('Falha ao criar usuário');
        }
        
        return response.json();
    },

    update: async (id: number, data: Partial<Usuario>) => {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error('Falha ao atualizar usuário');
        }
        
        return response.json();
    },

    delete: async (id: number) => {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Falha ao excluir usuário');
        }
    },
};