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
import { Plus, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { Consultorio } from "@/app/@types/consultorio";
import ConsultorioForm from "./components/consultorio-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ConsultorioService } from "../../services/consultorio-service";

export default function ConsultoriosList() {
    const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedConsultorio, setSelectedConsultorio] = useState<Consultorio | null>(null);

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

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>CNPJ</TableHead>
                        <TableHead>Cidade</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {consultorios.map((consultorio) => (
                        <TableRow key={consultorio.id}>
                            <TableCell>{consultorio.nome}</TableCell>
                            <TableCell>{consultorio.cnpj}</TableCell>
                            <TableCell>{consultorio.endereco.cidade}</TableCell>
                            <TableCell>{consultorio.contato.telefone}</TableCell>
                            <TableCell className="flex gap-2">
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
        </div>
    );
}