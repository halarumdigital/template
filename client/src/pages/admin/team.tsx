import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import DataTable from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTeamMemberSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, User, Shield, Bus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TeamPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: team, isLoading } = useQuery({
    queryKey: ["/api/team"],
  });

  const createTeamMemberMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/team", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      toast({
        title: "Sucesso",
        description: "Membro da equipe criado com sucesso",
      });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(createTeamMemberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "team",
      position: "",
      department: "",
      salary: 0,
      hireDate: "",
    },
  });

  const onSubmit = (data: any) => {
    createTeamMemberMutation.mutate({
      ...data,
      salary: parseFloat(data.salary),
    });
  };

  const columns = [
    {
      key: "position",
      header: "Membro",
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback>{value?.[0] || "M"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">{value || "Membro"}</div>
            <div className="text-sm text-gray-500">ID: #{row.id.slice(0, 8)}</div>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      header: "Departamento",
    },
    {
      key: "salary",
      header: "Salário",
      render: (value: string) => {
        if (!value) return "-";
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(parseFloat(value));
      },
    },
    {
      key: "createdAt",
      header: "Contratação",
      render: (value: string) => {
        if (!value) return "-";
        return new Date(value).toLocaleDateString("pt-BR");
      },
    },
    {
      key: "status",
      header: "Status",
      render: () => (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Ativo
        </Badge>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Layout title="Gerenciar Equipe">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Gerenciar Equipe">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Gerenciar Equipe
            </h2>
            <p className="text-gray-600">Lista completa de membros da equipe</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Novo Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
              <DialogHeader className="pb-4 border-b">
                <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-blue-600" />
                  Novo Membro da Equipe
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Preencha as informações para adicionar um novo membro à equipe
                </p>
              </DialogHeader>
              
              <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Dados Pessoais */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <User className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Dados Pessoais</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Nome *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Digite o nome" 
                                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Sobrenome *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Digite o sobrenome" 
                                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Email *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="email" 
                                  placeholder="email@exemplo.com" 
                                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Telefone</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="(11) 99999-9999" 
                                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Dados de Acesso */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <Shield className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Dados de Acesso</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Senha *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="password" 
                                  placeholder="Senha de acesso" 
                                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Nível de Permissão *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                    <SelectValue placeholder="Selecione o nível" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="admin">
                                    <div className="flex items-center">
                                      <Shield className="w-4 h-4 mr-2 text-red-500" />
                                      Administrador
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="team">
                                    <div className="flex items-center">
                                      <User className="w-4 h-4 mr-2 text-blue-500" />
                                      Equipe
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="client">
                                    <div className="flex items-center">
                                      <User className="w-4 h-4 mr-2 text-green-500" />
                                      Cliente
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Dados Profissionais */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <Bus className="w-5 h-5 text-green-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Dados Profissionais</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Cargo *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Ex: Desenvolvedor, Designer" 
                                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Departamento *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Ex: TI, Marketing, Vendas" 
                                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="salary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Salário</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="0.00" 
                                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="hireDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Data de Contratação</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="date" 
                                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </form>
                </Form>
              </div>

              {/* Footer com botões */}
              <div className="flex justify-end space-x-3 pt-4 border-t bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="px-6 py-2 h-11"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={createTeamMemberMutation.isPending}
                  className="px-6 py-2 h-11 bg-blue-600 hover:bg-blue-700"
                >
                  {createTeamMemberMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Membro
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Pesquisar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input className="pl-10" placeholder="Nome ou cargo..." />
                </div>
              </div>
              <div>
                <Label>Departamento</Label>
                <Input placeholder="Filtrar por departamento..." />
              </div>
              <div>
                <Label>Data de Contratação</Label>
                <Input type="date" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Table */}
        <DataTable
          columns={columns}
          data={team || []}
          onView={(member) => console.log("View", member)}
          onEdit={(member) => console.log("Edit", member)}
          onDelete={(member) => console.log("Delete", member)}
        />
      </div>
    </Layout>
  );
}
