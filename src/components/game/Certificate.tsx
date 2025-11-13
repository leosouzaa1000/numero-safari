import { Button } from '@/components/ui/button';
import { Download, Home } from 'lucide-react';

interface CertificateProps {
  onBack: () => void;
}

export function Certificate({ onBack }: CertificateProps) {
  const handleDownload = () => {
    // This would generate a certificate image in a real app
    alert('Em breve você poderá baixar seu certificado!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-purple to-primary flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-3xl w-full border-8 border-game-sun">
        <div className="text-center space-y-6">
          <div className="text-6xl">🏆</div>
          <h1 className="text-5xl font-black text-foreground">
            Certificado de Conquista
          </h1>
          <div className="border-t-4 border-b-4 border-game-sun py-8">
            <p className="text-2xl text-muted-foreground mb-4">
              Este certificado é concedido a
            </p>
            <p className="text-4xl font-black text-primary mb-4">
              GUARDIÃO DOS NÚMEROS
            </p>
            <p className="text-xl text-muted-foreground">
              Por completar a Missão dos Números Mágicos
              <br />
              e dominar os números de 1 a 50!
            </p>
          </div>
          <div className="flex gap-4 justify-center items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="text-4xl">💎</div>
            ))}
          </div>
          <div className="text-xl text-muted-foreground">
            Você coletou todos os 5 Cristais Mágicos!
          </div>
        </div>

        <div className="flex gap-4 mt-12">
          <Button
            onClick={onBack}
            size="lg"
            variant="outline"
            className="flex-1 text-xl py-6 rounded-full"
          >
            <Home className="w-6 h-6 mr-2" />
            Voltar ao Início
          </Button>
          <Button
            onClick={handleDownload}
            size="lg"
            className="flex-1 text-xl py-6 rounded-full bg-gradient-to-r from-success to-game-green"
          >
            <Download className="w-6 h-6 mr-2" />
            Baixar Certificado
          </Button>
        </div>
      </div>
    </div>
  );
}
