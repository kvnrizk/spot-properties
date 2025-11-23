import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { SimpleChart, CombinedChart } from "@/components/admin/simple-chart";
import { getDashboardAnalytics } from "@/lib/analytics";
import { Home, CheckCircle, Calendar, Users, TrendingUp, Clock } from "lucide-react";

export default async function AdminDashboard() {
  const analytics = await getDashboardAnalytics();

  const {
    propertyStats,
    leadStats,
    appointmentStats,
    charts,
  } = analytics;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome to Spot Properties Admin Panel"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Properties"
          value={propertyStats.total}
          icon={Home}
          color="blue"
          subtitle={`${propertyStats.published} published, ${propertyStats.draft} draft`}
        />
        <StatCard
          title="Total Leads"
          value={leadStats.total}
          icon={Users}
          color="green"
          subtitle={`${leadStats.pending} pending, ${leadStats.handled} handled`}
        />
        <StatCard
          title="Appointments"
          value={appointmentStats.total}
          icon={Calendar}
          color="purple"
          subtitle={`${appointmentStats.upcoming} upcoming`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SimpleChart
          data={charts.propertiesPerMonth}
          title="Properties Created (Last 12 Months)"
          color="blue"
        />
        <SimpleChart
          data={charts.leadsPerMonth}
          title="Leads Received (Last 12 Months)"
          color="green"
        />
      </div>

      <div className="mb-8">
        <CombinedChart
          properties={charts.propertiesPerMonth}
          leads={charts.leadsPerMonth}
          appointments={charts.appointmentsPerMonth}
          title="Activity Timeline (Last 12 Months)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-spot-dark mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-spot-red" />
            Quick Stats
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Published Properties</span>
              <span className="font-semibold text-green-600">
                {propertyStats.published}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Draft Properties</span>
              <span className="font-semibold text-yellow-600">
                {propertyStats.draft}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Leads</span>
              <span className="font-semibold text-yellow-600">
                {leadStats.pending}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Handled Leads</span>
              <span className="font-semibold text-green-600">
                {leadStats.handled}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-spot-dark mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-spot-red" />
            Upcoming Events
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Upcoming Appointments</span>
              <span className="font-semibold text-purple-600">
                {appointmentStats.upcoming}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Appointments</span>
              <span className="font-semibold text-spot-dark">
                {appointmentStats.total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
