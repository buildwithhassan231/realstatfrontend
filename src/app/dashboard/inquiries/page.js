import AgentInquiriesPage from "@/components/dashboard/inquiries/AgentInquiriesPage";

export const metadata = {
  title: "Inquiries — PropFind Dashboard",
  description: "View and manage all buyer inquiries for your listings.",
};

export default function InquiriesRoute() {
  return <AgentInquiriesPage />;
}
