interface ChartDataPoint {
  month: string;
  count: number;
}

interface SimpleChartProps {
  data: ChartDataPoint[];
  title: string;
  color?: string;
}

export function SimpleChart({ data, title, color = "blue" }: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.count), 1);

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  const bgColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-spot-dark mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item) => {
          const percentage = (item.count / maxValue) * 100;
          // Format month from YYYY-MM to MMM YYYY
          const [year, month] = item.month.split("-");
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const formattedMonth = `${monthNames[parseInt(month) - 1]} ${year}`;

          return (
            <div key={item.month}>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-600">{formattedMonth}</span>
                <span className="font-semibold text-spot-dark">{item.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${bgColor} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface CombinedChartProps {
  properties: ChartDataPoint[];
  leads: ChartDataPoint[];
  appointments: ChartDataPoint[];
  title: string;
}

export function CombinedChart({
  properties,
  leads,
  appointments,
  title,
}: CombinedChartProps) {
  // Calculate max value across all datasets
  const allCounts = [
    ...properties.map((d) => d.count),
    ...leads.map((d) => d.count),
    ...appointments.map((d) => d.count),
  ];
  const maxValue = Math.max(...allCounts, 1);

  // Combine data by month
  const combinedData = properties.map((item, index) => ({
    month: item.month,
    properties: item.count,
    leads: leads[index]?.count || 0,
    appointments: appointments[index]?.count || 0,
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-spot-dark mb-4">{title}</h3>
      <div className="mb-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-600">Properties</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-600">Leads</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-gray-600">Appointments</span>
        </div>
      </div>
      <div className="space-y-4">
        {combinedData.map((item) => {
          const [year, month] = item.month.split("-");
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const formattedMonth = `${monthNames[parseInt(month) - 1]} ${year}`;

          return (
            <div key={item.month}>
              <div className="text-sm font-medium text-gray-700 mb-2">
                {formattedMonth}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-24">Properties</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.properties / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">
                    {item.properties}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-24">Leads</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.leads / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">
                    {item.leads}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-24">Appointments</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.appointments / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">
                    {item.appointments}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
