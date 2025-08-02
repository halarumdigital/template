import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="max-w-md w-full mx-4">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Gerenciamento
              </h1>
              <p className="text-gray-600 mt-2">
                Faça login para acessar o sistema
              </p>
            </div>

            <Button onClick={handleLogin} className="w-full" size="lg">
              Entrar
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Sistema multi-role para administradores, clientes e equipe
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
