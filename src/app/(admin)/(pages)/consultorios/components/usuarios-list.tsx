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
            const data = await UsuarioService.getAllByIdConsultorio(consultorio);
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <h2 className="text-xl font-semibold">
                    Usuários - {consultorio.nome}
                </h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                        className="flex-1 sm:flex-none"
                        onClick={() => {
                            setSelectedUsuario(null);
                            setOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Novo Usuário
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        className="flex-1 sm:flex-none"
                    >
                        Fechar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden">
                {usuarios.map((usuario) => (
                    <div key={usuario.id} className="border-b pb-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">{usuario.pessoa.nome}</h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setSelectedUsuario(usuario);
                                            setOpen(true);
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive"
                                        onClick={() => usuario.id && handleDelete(usuario.id)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>{usuario.papel}</span>
                                <span>{usuario.pessoa.cpfCnpj}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Table className="hidden md:table">
                <TableHeader>
                    <TableRow>
                        <TableHead className="hidden md:table-cell">Nome</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Papel</TableHead>
                        <TableHead className="hidden md:table-cell">CPF/CNPJ</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {usuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                            <TableCell>
                                <div className="md:hidden space-y-1">
                                    <div className="font-bold">{usuario.pessoa.nome}</div>
                                    <div>{usuario.email}</div>
                                    <div>{usuario.papel}</div>
                                    <div>{usuario.pessoa.cpfCnpj}</div>
                                </div>
                                <span className="hidden md:block">{usuario.pessoa.nome}</span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{usuario.email}</TableCell>
                            <TableCell className="hidden md:table-cell">{usuario.papel}</TableCell>
                            <TableCell className="hidden md:table-cell">{usuario.pessoa.cpfCnpj}</TableCell>
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
                <DialogContent className="w-full max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUsuario ? 'Editar Usuário' : 'Novo Usuário'}
                        </DialogTitle>
                    </DialogHeader>
                    <UsuarioForm
                        consultorio={consultorio}
                        usuario={selectedUsuario || undefined}
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