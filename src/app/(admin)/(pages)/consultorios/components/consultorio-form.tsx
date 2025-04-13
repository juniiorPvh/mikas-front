'use client';

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/ui/button/Button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Consultorio } from "@/app/@types/consultorio";
import { ConsultorioService } from "@/app/(admin)/services/consultorio-service";

const consultorioSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    cnpj: z.string().min(1, "CNPJ é obrigatório"),
    endereco: z.object({
        rua: z.string().min(1, "Rua é obrigatória"),
        numero: z.string().min(1, "Número é obrigatório"),
        complemento: z.string().optional(),
        bairro: z.string().min(1, "Bairro é obrigatório"),
        cidade: z.string().min(1, "Cidade é obrigatória"),
        estado: z.string().min(1, "Estado é obrigatório"),
        cep: z.string().min(1, "CEP é obrigatório"),
    }),
    contato: z.object({
        telefone: z.string().min(1, "Telefone é obrigatório"),
        email: z.string().email("Email inválido"),
        site: z.string().optional(),
    }),
});

interface ConsultorioFormProps {
    consultorio?: Consultorio | null;
    onSuccess: () => void;
}

export default function ConsultorioForm({ consultorio, onSuccess }: ConsultorioFormProps) {
    const form = useForm<z.infer<typeof consultorioSchema>>({
        resolver: zodResolver(consultorioSchema),
        defaultValues: consultorio || {
            nome: "",
            cnpj: "",
            endereco: {
                rua: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                estado: "",
                cep: "",
            },
            contato: {
                telefone: "",
                email: "",
                site: "",
            },
        },
    });

    const onSubmit = async (data: z.infer<typeof consultorioSchema>) => {
        try {
            if (consultorio?.id) {
                await ConsultorioService.update(consultorio.id, data);
            } else {
                await ConsultorioService.create(data);
            }

            toast.success(`Consultório ${consultorio ? 'updated' : 'created'} successfully`);
            onSuccess();
        } catch (error) {
            toast.error("Failed to save consultório");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cnpj"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CNPJ</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Endereço</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Endereco fields */}
                        <FormField
                            control={form.control}
                            name="endereco.rua"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rua</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endereco.numero"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endereco.complemento"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Complemento</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endereco.bairro"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bairro</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endereco.cidade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endereco.estado"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endereco.cep"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CEP</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contato</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="contato.telefone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contato.email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contato.site"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Site</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" variant={consultorio ? "primary" : "outline"}>
                    {consultorio ? "Atualizar" : "Criar"} Consultório
                </Button>
            </form>
        </Form>
    );
}