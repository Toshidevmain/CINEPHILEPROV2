const ShowsSkeleton = ({ classname }: { classname?: string }) => {
  return (
    <div className={classname ?? "mt-12"}>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] w-full animate-pulse bg-[#333] rounded" />
        ))}
      </div>
    </div>
  );
};

export default ShowsSkeleton;
