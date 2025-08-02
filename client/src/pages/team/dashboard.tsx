import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/layout";
import StatsCard from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FolderOpen, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TeamDashboard() {
  const { user } = useAuth();
  
  const { data: teamMembers } = useQuery({
    queryKey: ["/api/team"],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Find current team member
  const currentTeamMember = teamMembers?.find((tm: any) => tm.userId === user?.id);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/team", currentTeamMember?.id],
    enabled: !!currentTeamMember?.id,
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      planning: { label: "Planejamento", className: "bg-gray-100 text-gray-800" },
      active: { label: "Em Andamento", className: "bg-blue-100 text-blue-800" },
      completed: { label: "Concluído", className: "bg-green-100 text-green-800" },
      on_hold: { label: "Pausado", className: "bg-yellow-100 text-yellow-800" },
      cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.planning;
    
    return (
      <Badge variant="secondary" className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (statsLoading || projectsLoading) {
    return (
      <Layout title="Dashboard da Equipe">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard da Equipe">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard da Equipe
          </h2>
          <p className="text-gray-600">Seus projetos e atividades</p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Projetos Ativos"
            value={stats?.activeProjects || 0}
            icon={FolderOpen}
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
          />
          
          <StatsCard
            title="Tarefas Pendentes"
            value={stats?.pendingTasks || 0}
            icon={Clock}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          
          <StatsCard
            title="Concluídas Hoje"
            value={stats?.completedToday || 0}
            icon={CheckCircle}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
        </div>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Projetos em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.slice(0, 4).map((project: any) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      {getStatusBadge(project.status)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {project.description || "Sem descrição"}
                    </p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progresso</span>
                      <span className="text-sm font-medium text-gray-900">
                        {project.progress || 0}%
                      </span>
                    </div>
                    
                    <Progress value={project.progress || 0} className="mb-4" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Prazo: {project.endDate ? new Date(project.endDate).toLocaleDateString("pt-BR") : "Não definido"}
                      </span>
                      <Button variant="ghost" size="sm">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Nenhum projeto atribuído</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
