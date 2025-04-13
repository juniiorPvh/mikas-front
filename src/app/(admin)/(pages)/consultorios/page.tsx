'use client'
import React, { useState, useEffect } from "react";
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
import { Consultorio } from "@/app/@types/consultorio";
import ConsultorioForm from "./components/consultorio-form";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ConsultorioService } from "../../services/consultorio-service";
import UsuariosList from "./components/usuarios-list";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ConsultoriosList() {
    const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedConsultorio, setSelectedConsultorio] = useState<Consultorio | null>(null);
    const [usuariosDialogOpen, setUsuariosDialogOpen] = useState(false);
    const [selectedConsultorioForUsers, setSelectedConsultorioForUsers] = useState<Consultorio | null>(null);

    const fetchConsultorios = async () => {
        try {
            const data = await ConsultorioService.getAll();
            setConsultorios(data);
        } catch (error) {
            toast.error("Falha ao carregar consultórios");
        }
    };

    useEffect(() => {
        fetchConsultorios();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await ConsultorioService.delete(id);
            toast.success("Consultório excluído com sucesso");
            fetchConsultorios();
        } catch (error) {
            toast.error("Falha ao excluir consultório");
        }
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Lista de Consultórios</h1>
                <Button onClick={() => {
                    setSelectedConsultorio(null);
                    setOpen(true);
                }}>
                    <Plus className="mr-2 h-4 w-4" /> Novo Consultório
                </Button>
            </div>

            <Table className="min-w-full overflow-x-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead className="hidden md:table-cell">Nome</TableHead>
                        <TableHead className="hidden md:table-cell">CNPJ</TableHead>
                        <TableHead className="hidden md:table-cell">Cidade</TableHead>
                        <TableHead className="hidden md:table-cell">Telefone</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {consultorios.map((consultorio) => (
                        <TableRow key={consultorio.id} className="relative">
                            <TableCell className="md:table-cell">
                                <div className="md:hidden font-bold mb-1">Nome:</div>
                                {consultorio.nome}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{consultorio.cnpj}</TableCell>
                            <TableCell className="hidden md:table-cell">{consultorio.endereco.cidade}</TableCell>
                            <TableCell className="hidden md:table-cell">{consultorio.contato.telefone}</TableCell>
                            <TableCell className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        setSelectedConsultorioForUsers(consultorio);
                                        setUsuariosDialogOpen(true);
                                    }}
                                >
                                    <Users className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        setSelectedConsultorio(consultorio);
                                        setOpen(true);
                                    }}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => consultorio.id && handleDelete(consultorio.id)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Update Sheet content for mobile */}
            <Sheet open={usuariosDialogOpen} onOpenChange={setUsuariosDialogOpen}>
                <SheetContent 
                    side="right" 
                    className="w-full md:w-[1200px] md:max-w-[1200px] overflow-y-auto p-4"
                >
                    <SheetHeader>
                        <SheetTitle>Gerenciar Usuários</SheetTitle>
                    </SheetHeader>
                    {selectedConsultorioForUsers && (
                        <UsuariosList
                            consultorio={selectedConsultorioForUsers}
                            onClose={() => setUsuariosDialogOpen(false)}
                        />
                    )}
                </SheetContent>
            </Sheet>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedConsultorio ? 'Editar Consultório' : 'Novo Consultório'}
                        </DialogTitle>
                    </DialogHeader>
                    <ConsultorioForm
                        consultorio={selectedConsultorio}
                        onSuccess={() => {
                            setOpen(false);
                            fetchConsultorios();
                        }}
                    />
                </DialogContent>
            </Dialog>
            {/* Replace Dialog with Sheet */}
            <Sheet open={usuariosDialogOpen} onOpenChange={setUsuariosDialogOpen}>
                <SheetContent side="right" className="w-[1200px] sm:max-w-[1200px] overflow-y-auto p-4">
                    <SheetHeader>
                        <SheetTitle>Gerenciar Usuários</SheetTitle>
                    </SheetHeader>
                    {selectedConsultorioForUsers && (
                        <UsuariosList
                            consultorio={selectedConsultorioForUsers}
                            onClose={() => setUsuariosDialogOpen(false)}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}