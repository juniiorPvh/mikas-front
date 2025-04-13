"use client";

import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import api from "@/services/api";

export default function ClientesList(){


return (
        <div>
            <h1>Lista de Clientes</h1>
            {/*<Link to="/clientes/novo" className="btn btn-primary">Novo Cliente</Link>*/}
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
                {/*{clientes.map(cliente => (*/}
                {/*    <tr key={cliente.id}>*/}
                {/*        <td>{cliente.pessoa.nome}</td>*/}
                {/*        <td>{cliente.pessoa.cpfCnpj}</td>*/}
                {/*        <td>{cliente.pessoa.email}</td>*/}
                {/*        <td>*/}
                {/*            /!*<Link to={`/clientes/editar/${cliente.id}`} className="btn btn-warning">Editar</Link>*!/*/}
                {/*            <button onClick={() => excluirCliente(cliente.id)} className="btn btn-danger">Excluir*/}
                {/*            </button>*/}
                {/*        </td>*/}
                {/*    </tr>*/}
                {/*))}*/}
                </tbody>
            </table>
        </div>
    );
};

// export default ClientesList;
