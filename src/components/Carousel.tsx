export function Carousel<T>({
  title,
  items,
  renderItem,
}: {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">{items.map(renderItem)}</div>
    </section>
  );
}
