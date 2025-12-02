interface DashboardHeaderProps {
  date: Date | undefined;
}

export function DashboardHeader({ date }: DashboardHeaderProps) {

  const localeDate = date?.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric"
  })

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">{localeDate}</h1>
    </div>
  )
}