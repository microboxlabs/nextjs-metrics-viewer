export default function MetricsView() {
  return (
    <div className="flex w-full gap-8">
      <h2 className="text-white">Summary</h2>
      <article className="aspect-square w-24 bg-yellow-400">
        <h3 className="text-white">Max</h3>
      </article>
      <article className="aspect-square w-24 bg-yellow-400">
        <h3 className="text-white">Min</h3>
      </article>
      <article className="aspect-square w-24 bg-yellow-400">
        <h3 className="text-white">Average</h3>
      </article>
      <article className="aspect-square w-24 bg-yellow-400">
        <h3 className="text-white">MAX</h3>
      </article>
    </div>
  );
}
