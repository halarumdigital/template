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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeamMemberSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search } from "lucide-react";
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
    resolver: zodResolver(insertTeamMemberSchema),
    defaultValues: {
      position: "",
      department: "",
      salary: "",
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Membro da Equipe</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Departamento</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salário</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createTeamMemberMutation.isPending}>
                      {createTeamMemberMutation.isPending ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </form>
              </Form>
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
