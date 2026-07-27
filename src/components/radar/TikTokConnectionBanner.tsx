const ERROR_MESSAGES: Record<string, string> = {
  invalid_state: "A verificação de segurança falhou (state inválido). Tenta conectar de novo.",
  token_exchange_failed: "O TikTok recusou a troca de token. Tenta de novo em alguns minutos.",
};

export function TikTokConnectionBanner({
  isConnected,
  status,
  detail,
}: {
  isConnected: boolean;
  status?: string;
  detail?: string;
}) {
  if (status === "connected") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        ✅ Conta TikTok Shop conectada com sucesso.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        ❌ {detail ? ERROR_MESSAGES[detail] ?? detail : "Não deu pra conectar o TikTok Shop."}{" "}
        <a href="/api/tiktok/connect" className="underline">
          Tentar de novo
        </a>
      </div>
    );
  }

  if (isConnected) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
      <span>
        Conecte sua conta do TikTok Shop pra ver produtos reais aqui (por enquanto os dados abaixo
        são de teste).
      </span>
      <a
        href="/api/tiktok/connect"
        className="shrink-0 rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800"
      >
        Conectar TikTok Shop
      </a>
    </div>
  );
}
