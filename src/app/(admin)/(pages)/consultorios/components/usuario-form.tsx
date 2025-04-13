'use client';

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UsuarioService } from "../../../services/usuario-service";
import { Consultorio } from "@/app/@types/consultorio";
import { Usuario } from "@/app/@types/usuario";
import { formatCep, formatCpfCnpj, formatTelefone } from "@/lib/utils";

const usuarioSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    papel: z.enum(['ADMIN', 'PROFISSIONAL', 'PACIENTE']),
    pessoa: z.object({
        nome: z.string().min(1, "Nome é obrigatório"),
        cpfCnpj: z.string().min(1, "CPF/CNPJ é obrigatório"),
        dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
        endereco: z.object({
            rua: z.string().min(1, "Rua é obrigatória"),
            numero: z.string().min(1, "Número é obrigatório"),
            complemento: z.string().optional(),
            bairro: z.string().min(1, "Bairro é obrigatório"),
            cidade: z.string().min(1, "Cidade é obrigatória"),
            estado: z.string().min(1, "Estado é obrigatório"),
            cep: z.string().min(1, "CEP é obrigatório"),
        }).optional(),
        contato: z.object({
            telefone: z.string().min(1, "Telefone é obrigatório"),
            email: z.string().email("Email inválido"),
            site: z.string().optional(),
        }).optional(),
    }),
});

interface UsuarioFormProps {
    consultorio: Consultorio;
    usuario?: Usuario;
    onSuccess: () => void;
}

export default function UsuarioForm({ consultorio, usuario, onSuccess }: UsuarioFormProps) {
    const form = useForm<z.infer<typeof usuarioSchema>>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: usuario || {
            email: "",
            senha: "",
            papel: "PACIENTE",
            pessoa: {
                nome: "",
                cpfCnpj: "",
                dataNascimento: "",
            },
        },
    });

    const onSubmit = async (data: z.infer<typeof usuarioSchema>) => {
        console.log('Form submitted:', data); // Add this line
        try {
            const userData = {
                ...data,
                consultorio,
                pessoa: {
                    ...data.pessoa,
                    endereco: data.pessoa.endereco || undefined,
                    contato: data.pessoa.contato || undefined,
                }
            };

            if (usuario?.id) {
                await UsuarioService.update(usuario.id, userData);
                toast.success("Usuário atualizado com sucesso");
            } else {
                await UsuarioService.create(userData);
                toast.success("Usuário criado com sucesso");
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Falha ao salvar usuário");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="senha"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="papel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Papel</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um papel" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Administrador</SelectItem>
                                        <SelectItem value="PROFISSIONAL">Profissional</SelectItem>
                                        <SelectItem value="PACIENTE">Paciente</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Dados Pessoais</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            control={form.control}
                            name="pessoa.nome"
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="pessoa.cpfCnpj"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CPF/CNPJ</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                const value = formatCpfCnpj(e.target.value);
                                                field.onChange(value);
                                            }}
                                            maxLength={18}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pessoa.dataNascimento"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data de Nascimento</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {usuario && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium mt-6">Endereço</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="pessoa.endereco.rua"
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
                                    name="pessoa.endereco.numero"
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
                                    name="pessoa.endereco.complemento"
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
                                    name="pessoa.endereco.bairro"
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
                                    name="pessoa.endereco.cidade"
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
                                    name="pessoa.endereco.estado"
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
                                    name="pessoa.endereco.cep"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CEP</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    onChange={(e) => {
                                                        const value = formatCep(e.target.value);
                                                        field.onChange(value);
                                                    }}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    <h3 className="text-lg font-medium mt-6">Contato</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="pessoa.contato.telefone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            onChange={(e) => {
                                                const value = formatTelefone(e.target.value);
                                                field.onChange(value);
                                            }}
                                            value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pessoa.contato.email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email de Contato</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pessoa.contato.site"
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

                <div className="flex justify-end gap-4">
                    <Button
                        type="submit"
                        className="w-full sm:w-auto"
                    >
                        {usuario ? "Atualizar" : "Criar"} Usuário
                    </Button>
                </div>
            </form>
        </Form>
    );
}