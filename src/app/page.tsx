import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-3xl font-bold">CreatorPilot</h1>
      <p className="text-slate-600">
        O cockpit do criador afiliado do TikTok Shop — o que promover, o que falar, e quanto você
        está ganhando, em um só lugar.
      </p>
      <Link
        href="/login"
        className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-800"
      >
        Entrar
      </Link>
    </main>
  );
}
