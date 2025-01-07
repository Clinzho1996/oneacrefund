import FarmerEnrollment from "@/components/FarmerEnrollment";
import HeaderBox from "@/components/HeaderBox";
import StaffInfo from "@/components/StaffInfo";

function Dashboard() {
	return (
		<div>
			<HeaderBox />
			<div className="bg-[#F6F8FA] flex flex-col h-screen px-4 py-2  gap-4">
				<StaffInfo />
				<FarmerEnrollment />
			</div>
		</div>
	);
}

export default Dashboard;
