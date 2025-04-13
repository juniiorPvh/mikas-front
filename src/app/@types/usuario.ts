import { Consultorio } from "@/app/@types/consultorio";

export interface Usuario {
    id?: number;
    email: string;
    senha: string;
    papel: 'ADMIN' | 'PROFISSIONAL' | 'PACIENTE';
    consultorio: Consultorio;
    pessoa: {
        id?: number;
        nome: string;
        cpfCnpj: string;
        dataNascimento: string;
        endereco?: {
            rua: string;
            numero: string;
            complemento?: string;
            bairro: string;
            cidade: string;
            estado: string;
            cep: string;
        };
        contato?: {
            telefone: string;
            email?: string;
            site?: string;
        };
    };
}