interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-muted-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">This page is coming soon...</p>
      </div>
    </div>
  );
}
