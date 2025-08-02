import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import StatsCard from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, FolderOpen, Bus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/clients"],
  });

  if (statsLoading || clientsLoading) {
    return (
      <Layout title="Dashboard Administrativo">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Layout title="Dashboard Administrativo">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard Administrativo
          </h2>
          <p className="text-gray-600">
            Visão geral do sistema e estatísticas principais
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Clientes"
            value={stats?.totalClients || 0}
            icon={Users}
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
            trend={{
              value: "+12%",
              isPositive: true,
              label: "vs mês anterior",
            }}
          />
          
          <StatsCard
            title="Receita Total"
            value={formatCurrency(stats?.totalRevenue || 0)}
            icon={DollarSign}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            trend={{
              value: "+8%",
              isPositive: true,
              label: "vs mês anterior",
            }}
          />
          
          <StatsCard
            title="Projetos Ativos"
            value={stats?.activeProjects || 0}
            icon={FolderOpen}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            trend={{
              value: "+3",
              isPositive: true,
              label: "novos esta semana",
            }}
          />
          
          <StatsCard
            title="Equipe"
            value={stats?.teamMembers || 0}
            icon={Bus}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
            trend={{
              value: "100%",
              isPositive: true,
              label: "ativos",
            }}
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Receita dos Últimos 6 Meses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-500">Gráfico de Receita</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Integração com biblioteca de gráficos será implementada
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clientes Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients?.slice(0, 3).map((client: any) => (
                  <div key={client.id} className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {client.companyName?.[0] || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {client.companyName || "Cliente"}
                      </p>
                      <p className="text-sm text-gray-600">{client.phone}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Ativo
                    </Badge>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum cliente encontrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
