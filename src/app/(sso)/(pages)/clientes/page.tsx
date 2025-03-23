import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

const ClientesList: React.FC = () => {
    const [clientes, setClientes] = useState<any[]>([]);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/clientes');
                setClientes(response.data);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };
        fetchClientes();
    }, []);

    const excluirCliente = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await axios.delete(`http://localhost:8080/clientes/${id}`);
                setClientes(clientes.filter(cliente => cliente.id !== id));
            } catch (error) {
                console.error('Erro ao excluir cliente:', error);
            }
        }
    };

    return (
        <div>
            <h1>Lista de Clientes</h1>
            <Link to="/clientes/novo" className="btn btn-primary">Novo Cliente</Link>
            <table className="table">
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>CPF/CNPJ</th>
                    <th>E-mail</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {clientes.map(cliente => (
                    <tr key={cliente.id}>
                        <td>{cliente.pessoa.nome}</td>
                        <td>{cliente.pessoa.cpfCnpj}</td>
                        <td>{cliente.pessoa.email}</td>
                        <td>
                            <Link to={`/clientes/editar/${cliente.id}`} className="btn btn-warning">Editar</Link>
                            <button onClick={() => excluirCliente(cliente.id)} className="btn btn-danger">Excluir
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientesList;
