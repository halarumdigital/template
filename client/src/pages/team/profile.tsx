import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { insertTeamMemberSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bus } from "lucide-react";

export default function TeamProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teamMembers } = useQuery({
    queryKey: ["/api/team"],
  });

  // Find current team member
  const currentTeamMember = teamMembers?.find((tm: any) => tm.userId === user?.id);

  const updateTeamMemberMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!currentTeamMember?.id) throw new Error("Team member not found");
      await apiRequest("PUT", `/api/team/${currentTeamMember.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso",
      });
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
    resolver: zodResolver(insertTeamMemberSchema.partial()),
    defaultValues: {
      position: currentTeamMember?.position || "",
      department: currentTeamMember?.department || "",
      salary: currentTeamMember?.salary?.toString() || "",
    },
    values: {
      position: currentTeamMember?.position || "",
      department: currentTeamMember?.department || "",
      salary: currentTeamMember?.salary?.toString() || "",
    },
  });

  const onSubmit = (data: any) => {
    updateTeamMemberMutation.mutate({
      ...data,
      salary: data.salary ? parseFloat(data.salary) : undefined,
    });
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const formatCurrency = (value: string | number | undefined) => {
    if (!value) return "Não informado";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue);
  };

  return (
    <Layout title="Meu Perfil">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Meu Perfil</h2>
          <p className="text-gray-600">Gerencie suas informações profissionais</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Usuário</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage
                  src={user?.profileImageUrl || ""}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="text-xl">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email?.split("@")[0] || "Usuário"}
              </h3>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <Bus className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                <p className="text-sm font-medium text-purple-800">Equipe</p>
              </div>

              {/* Additional Info */}
              <div className="mt-6 space-y-3 text-left">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Cargo:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {currentTeamMember?.position || "Não informado"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Departamento:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {currentTeamMember?.department || "Não informado"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Salário:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(currentTeamMember?.salary)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: Desenvolvedor Frontend" />
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
                            <Input {...field} placeholder="Ex: Tecnologia" />
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
                            <Input 
                              {...field} 
                              type="number" 
                              step="0.01" 
                              placeholder="0.00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={updateTeamMemberMutation.isPending}>
                        {updateTeamMemberMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Work Summary Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resumo do Trabalho</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">5</div>
                    <div className="text-sm text-blue-800">Projetos Ativos</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-yellow-800">Tarefas Pendentes</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-green-800">Concluídas Hoje</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
