export default function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-20 bg-gray-200 rounded-xl"
        />
      ))}
    </div>
  );
}