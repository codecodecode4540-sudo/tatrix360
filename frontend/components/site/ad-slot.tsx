export function AdSlot({ label = 'Advertisement' }: { label?: string }) {
  return (
    <div className="flex min-h-[250px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}
