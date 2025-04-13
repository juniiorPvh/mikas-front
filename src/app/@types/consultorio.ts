export interface Endereco {
    id?: number;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}

export interface Contato {
    id?: number;
    telefone: string;
    email: string;
    site?: string;
}

export interface Consultorio {
    id?: number;
    nome: string;
    cnpj: string;
    endereco: Endereco;
    contato: Contato;
}