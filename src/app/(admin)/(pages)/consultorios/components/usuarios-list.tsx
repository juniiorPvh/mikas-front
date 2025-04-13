'use client';

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash, Users } from "lucide-react";
import { toast } from "sonner";
import { UsuarioService } from "../../../services/usuario-service";
import { Usuario } from '@/app/@types/usuario';
import UsuarioForm from "./usuario-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Consultorio } from '@/app/@types/consultorio';

interface UsuariosListProps {
    consultorio: Consultorio;
    onClose: () => void;
}

export default function UsuariosList({ consultorio, onClose }: UsuariosListProps) {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

    const fetchUsuarios = async () => {
        try {
            const data = await UsuarioService.getAll();
            const usuariosDoConsultorio = data.filter(
                (usuario: Usuario) => usuario.consultorio.id === consultorio.id
            );
            setUsuarios(usuariosDoConsultorio);
        } catch (error) {
            toast.error("Falha ao carregar usuários");
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, [consultorio.id]);

    const handleDelete = async (id: number) => {
        try {
            await UsuarioService.delete(id);
            toast.success("Usuário excluído com sucesso");
            fetchUsuarios();
        } catch (error) {
            toast.error("Falha ao excluir usuário");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                    Usuários - {consultorio.nome}
                </h2>
                <div className="space-x-2">
                    <Button onClick={() => {
                        setSelectedUsuario(null);
                        setOpen(true);
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Novo Usuário
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Fechar
                    </Button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Papel</TableHead>
                        <TableHead>CPF/CNPJ</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {usuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                            <TableCell>{usuario.pessoa.nome}</TableCell>
                            <TableCell>{usuario.email}</TableCell>
                            <TableCell>{usuario.papel}</TableCell>
                            <TableCell>{usuario.pessoa.cpfCnpj}</TableCell>
                            <TableCell className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        setSelectedUsuario(usuario);
                                        setOpen(true);
                                    }}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => usuario.id && handleDelete(usuario.id)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUsuario ? 'Editar Usuário' : 'Novo Usuário'}
                        </DialogTitle>
                    </DialogHeader>
                    <UsuarioForm
                        consultorio={consultorio}
                        usuario={selectedUsuario}
                        onSuccess={() => {
                            setOpen(false);
                            fetchUsuarios();
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}