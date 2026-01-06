import Link from 'next/link';
import { ArrowRight, User, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import { Conversion } from '@/types';
import { formatDateTime } from '@/lib/utils';

interface RecentRegistrationsProps {
  conversions: Conversion[];
}

export function RecentRegistrations({ conversions }: RecentRegistrationsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          Cadastros Recentes
        </CardTitle>
        <Link href="/cadastros">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Ver todos
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {conversions.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum cadastro realizado ainda</p>
            <p className="text-sm mt-1">
              Compartilhe seu link para comecar a ganhar!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversions.slice(0, 5).map((conversion) => (
              <div
                key={conversion.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {conversion.user_name || 'Usuario'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {conversion.user_email || '-'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      conversion.user_type === 'athlete' ? 'success' : 'info'
                    }
                  >
                    {conversion.user_type === 'athlete' ? 'Atleta' : 'Scout'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateTime(conversion.conversion_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
