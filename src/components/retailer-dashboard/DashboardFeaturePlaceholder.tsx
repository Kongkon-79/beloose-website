import DashboardState from "./DashboardState";

export default function DashboardFeaturePlaceholder({ feature }: { feature: string }) {
  return <DashboardState type="empty" title={`${feature} is next`} message={`The route is ready. Its API-backed interface will be added from the ${feature} reference you provide.`}/>;
}
