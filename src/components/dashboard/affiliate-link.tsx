'use client';

import { useState } from 'react';
import { Copy, Check, Share2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { getAffiliateLink, copyToClipboard } from '@/lib/utils';

interface AffiliateLinkProps {
  affiliateCode: string;
}

export function AffiliateLink({ affiliateCode }: AffiliateLinkProps) {
  const [copied, setCopied] = useState(false);
  const link = getAffiliateLink(affiliateCode);

  const handleCopy = async () => {
    await copyToClipboard(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cadastre-se no DNA de Craque',
          text: 'Use meu link para se cadastrar no DNA de Craque e descobrir talentos do esporte!',
          url: link,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Card id="link">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#FCD34D]" />
          Seu Link de Afiliado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Compartilhe este link para registrar novos usuarios e ganhar comissoes.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <span className="text-sm text-gray-600 truncate flex-1">{link}</span>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              variant={copied ? 'primary' : 'outline'}
              leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>

            <Button onClick={handleShare} leftIcon={<Share2 className="w-4 h-4" />}>
              Compartilhar
            </Button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-[#FEF9E7] rounded-lg">
          <p className="text-sm text-black">
            <strong>Seu codigo:</strong> {affiliateCode}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Este codigo e unico e sera usado para rastrear seus cadastros.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
