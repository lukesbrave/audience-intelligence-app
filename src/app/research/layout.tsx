export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout is now handled by DashboardLayout in page.tsx
  // This keeps the route structure but delegates layout to the page
  return <>{children}</>;
}
