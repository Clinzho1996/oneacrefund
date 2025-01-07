import HeaderBox from "@/components/HeaderBox";
import { columns } from "@/config/columns";
import { DataTable } from "@/config/data-table";
import { data } from "@/constants";

function StaffManagement() {
	return (
		<div>
			<HeaderBox />
			<div className="bg-[#F6F8FA] flex flex-col h-full px-4 py-2 gap-4">
				<DataTable columns={columns} data={data} />
			</div>
		</div>
	);
}

export default StaffManagement;
