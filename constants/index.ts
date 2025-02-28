import { Project } from "@/config/project-columns";

export const sidebarLinks = [
	{
		label: "Dashboard",
		route: "/dashboard",
		imgUrl: "/icons/dashboard.svg",
	},
	{
		label: "Farmer Management",
		route: "/farmer-management",
		imgUrl: "/icons/farmer.svg",
	},
	// {
	// 	label: "Project Management",
	// 	route: "/project-management",
	// 	imgUrl: "/icons/project.svg",
	// },
	{
		label: "Device Management",
		route: "/device-management",
		imgUrl: "/icons/device.svg",
	},

	{
		label: "Staff Management",
		route: "/staff-management",
		imgUrl: "/icons/staff.svg",
	},
	{
		label: "Location Management",
		route: "/location-management",
		imgUrl: "/icons/location.svg",
	},
	{
		label: "Log Activity",
		route: "/log-activity",
		imgUrl: "/icons/log.svg",
	},
];

export const projectData: Project[] = [
	{
		id: "00001",
		projectName: "Fertilizer Distribution",
		startDate: "12th Jan. 2025",
		endDate: "12th Jan. 2026",
		status: "ongoing",
	},
	{
		id: "00002",
		projectName: "Irrigation Expansion",
		startDate: "15th Feb. 2025",
		endDate: "20th Dec. 2025",
		status: "yet to start",
	},
	{
		id: "00003",
		projectName: "Soil Testing Initiative",
		startDate: "10th Mar. 2025",
		endDate: "10th Sep. 2025",
		status: "ongoing",
	},
	{
		id: "00004",
		projectName: "Crop Rotation Program",
		startDate: "1st Apr. 2025",
		endDate: "1st Apr. 2026",
		status: "close",
	},
	{
		id: "00005",
		projectName: "Organic Farming Training",
		startDate: "5th May. 2025",
		endDate: "5th Nov. 2025",
		status: "ongoing",
	},
	{
		id: "00006",
		projectName: "Smart Farming Implementation",
		startDate: "12th Jun. 2025",
		endDate: "12th Dec. 2025",
		status: "yet to start",
	},
	{
		id: "00007",
		projectName: "Livestock Breeding Program",
		startDate: "20th Jul. 2025",
		endDate: "20th Jan. 2026",
		status: "ongoing",
	},
	{
		id: "00008",
		projectName: "Pest Control Research",
		startDate: "1st Aug. 2025",
		endDate: "1st Feb. 2026",
		status: "yet to start",
	},
	{
		id: "00009",
		projectName: "Farmers' Cooperative Expansion",
		startDate: "10th Sep. 2025",
		endDate: "10th Mar. 2026",
		status: "close",
	},
	{
		id: "00010",
		projectName: "Climate Change Adaptation",
		startDate: "5th Oct. 2025",
		endDate: "5th Apr. 2026",
		status: "ongoing",
	},
];
