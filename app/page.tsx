export default function Home({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div>
          You might be looking for: <a className="underline" href="/learnosity-inline">Learnosity</a>
        </div>
        {children}
      </div>
    </main>
  );
}
