import CustomerEnrollment from "@/components/CustomerEnrollment";
import FarmerEnrollment from "@/components/FarmerEnrollment";
import HeaderBox from "@/components/HeaderBox";
import StaffInfo from "@/components/StaffInfo";

function Dashboard() {
	return (
		<div className="min-h-screen flex flex-col">
			<HeaderBox />
			<div className="bg-[#F6F8FA] flex flex-col h-full px-4 py-2  gap-4">
				<StaffInfo />
				<FarmerEnrollment />
				<CustomerEnrollment />
			</div>
		</div>
	);
}

export default Dashboard;
